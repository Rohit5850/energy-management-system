// SQLite via Node's BUILT-IN module (node:sqlite) — no native compile, no
// external dependency. File-based SQL DB at data/ems.db.
import { createRequire } from "node:module";
import path from "path";
import fs from "fs";
import { hashPassword, randomToken } from "./crypto";

// Load Node's built-in SQLite at runtime (bypasses the bundler so it resolves
// reliably inside Next.js).
const nodeRequire = createRequire(import.meta.url);
const { DatabaseSync } = nodeRequire("node:sqlite");

let _db = null;

function getDb() {
  if (_db) return _db;
  const dir = path.join(process.cwd(), "data");
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  _db = new DatabaseSync(path.join(dir, "ems.db"));
  try { _db.exec("PRAGMA journal_mode = WAL;"); } catch (e) {}
  init(_db);
  return _db;
}

function init(db) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS companies (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      mode TEXT NOT NULL DEFAULT 'hybrid',
      created_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      company_id INTEGER NOT NULL,
      username TEXT NOT NULL UNIQUE,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'admin',
      created_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS password_resets (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      token TEXT NOT NULL UNIQUE,
      expires_at INTEGER NOT NULL,
      used INTEGER NOT NULL DEFAULT 0
    );
    CREATE TABLE IF NOT EXISTS meters (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      company_id INTEGER NOT NULL,
      name TEXT, tag TEXT, measures TEXT, live TEXT, address TEXT,
      status TEXT, lvl INTEGER DEFAULT 0
    );
    CREATE TABLE IF NOT EXISTS alarms (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      company_id INTEGER NOT NULL,
      severity TEXT, sev_class TEXT, location TEXT, area TEXT,
      condition TEXT, value TEXT, lim TEXT, raised_at TEXT, status TEXT DEFAULT 'open'
    );
  `);
}

// ---- auth queries ----
export function createAccount({ companyName, mode, username, email, password }) {
  const db = getDb();
  const now = new Date().toISOString();
  db.exec("BEGIN");
  try {
    const c = db.prepare("INSERT INTO companies (name, mode, created_at) VALUES (?,?,?)")
      .run(companyName, mode, now);
    const companyId = Number(c.lastInsertRowid);
    const u = db.prepare(
      "INSERT INTO users (company_id, username, email, password_hash, role, created_at) VALUES (?,?,?,?,?,?)"
    ).run(companyId, username, email, hashPassword(password), "admin", now);
    const userId = Number(u.lastInsertRowid);
    seedDemo(db, companyId);
    db.exec("COMMIT");
    return { userId, companyId };
  } catch (e) {
    try { db.exec("ROLLBACK"); } catch (e2) {}
    throw e;
  }
}

export function findUserByLogin(login) {
  return getDb().prepare(
    `SELECT u.*, c.mode AS company_mode, c.name AS company_name
     FROM users u JOIN companies c ON c.id = u.company_id
     WHERE u.username = ? OR u.email = ?`
  ).get(login, login);
}

export function getUserById(id) {
  return getDb().prepare(
    `SELECT u.*, c.mode AS company_mode, c.name AS company_name
     FROM users u JOIN companies c ON c.id = u.company_id WHERE u.id = ?`
  ).get(id);
}

export function emailOrUsernameExists(username, email) {
  return getDb().prepare("SELECT id FROM users WHERE username = ? OR email = ?").get(username, email);
}

// ---- password reset ----
export function createReset(userId) {
  const db = getDb();
  const token = randomToken();
  const expires = Date.now() + 1000 * 60 * 30; // 30 min
  db.prepare("INSERT INTO password_resets (user_id, token, expires_at, used) VALUES (?,?,?,0)")
    .run(userId, token, expires);
  return token;
}

export function consumeReset(token, newPassword) {
  const db = getDb();
  const row = db.prepare("SELECT * FROM password_resets WHERE token = ?").get(token);
  if (!row) return { ok: false, error: "Invalid reset link." };
  if (row.used) return { ok: false, error: "This reset link was already used." };
  if (Date.now() > Number(row.expires_at)) return { ok: false, error: "This reset link has expired." };
  db.exec("BEGIN");
  try {
    db.prepare("UPDATE users SET password_hash = ? WHERE id = ?").run(hashPassword(newPassword), row.user_id);
    db.prepare("UPDATE password_resets SET used = 1 WHERE id = ?").run(row.id);
    db.exec("COMMIT");
  } catch (e) {
    try { db.exec("ROLLBACK"); } catch (e2) {}
    throw e;
  }
  return { ok: true };
}

// ---- dashboard data ----
// node:sqlite returns null-prototype rows; spread into plain objects so they
// can be passed from Server Components to Client Components.
export function getMeters(companyId) {
  return getDb().prepare("SELECT * FROM meters WHERE company_id = ? ORDER BY id").all(companyId).map((r) => ({ ...r }));
}
export function getAlarms(companyId) {
  return getDb().prepare("SELECT * FROM alarms WHERE company_id = ? ORDER BY id").all(companyId).map((r) => ({ ...r }));
}

// ---- add / delete device (meter) ----
export function addMeter(companyId, d) {
  const db = getDb();
  const r = db.prepare(
    "INSERT INTO meters (company_id,name,tag,measures,live,address,status,lvl) VALUES (?,?,?,?,?,?,?,?)"
  ).run(
    companyId,
    d.name || "",
    d.tag || "",
    d.measures || "",
    d.live || "—",
    d.address || "",
    d.status === "warn" ? "warn" : "ok",
    d.lvl ? 1 : 0
  );
  return Number(r.lastInsertRowid);
}

export function deleteMeter(companyId, id) {
  getDb().prepare("DELETE FROM meters WHERE id = ? AND company_id = ?").run(Number(id), companyId);
}

function seedDemo(db, companyId) {
  const meters = [
    ["Main incomer", "EM-00", "kVA · PF · kWh", "1,940 kVA", "1 · 40001", "ok", 0],
    ["Chiller CH-01", "EM-01", "kW + BTU (TR)", "182 kW", "2 · 40001", "ok", 1],
    ["Chiller CH-02", "EM-02", "kW + BTU (TR)", "206 kW", "3 · 40001", "warn", 1],
    ["Air compressor", "EM-03", "kW + air flow", "96 kW", "4 · 40001", "ok", 1],
    ["Boiler", "EM-04", "kW + steam", "3.2 TPH", "5 · 40001", "ok", 1],
    ["Production line 1", "EM-05", "kWh", "214 kW", "6 · 40001", "ok", 1],
    ["Production line 2", "EM-06", "kWh", "198 kW", "7 · 40001", "ok", 1],
    ["HVAC / AHUs", "EM-07", "kW", "340 kW", "8 · 40001", "ok", 1],
    ["Lighting + admin", "EM-08", "group kWh", "48 kW", "9 · 40001", "ok", 1],
  ];
  const im = db.prepare("INSERT INTO meters (company_id,name,tag,measures,live,address,status,lvl) VALUES (?,?,?,?,?,?,?,?)");
  for (const m of meters) im.run(companyId, ...m);

  const alarms = [
    ["Action", "crit", "Chiller CH-02", "Utility", "Efficiency drift", "0.79 kW/TR", "≤ 0.70", "10:41:12", "open"],
    ["Alert", "warn", "Main incomer", "Demand", "Demand near contract", "1,940 kVA", "≤ 2,000", "09:12:40", "open"],
    ["Alert", "warn", "Compressor room", "Compressed air", "Night flow high (leak)", "38%", "≤ 15%", "06:52:31", "open"],
    ["System", "info", "Gateway GW-01", "Edge", "Net lost — data buffered", "312 rec", "—", "08:14:05", "closed"],
  ];
  const ia = db.prepare("INSERT INTO alarms (company_id,severity,sev_class,location,area,condition,value,lim,raised_at,status) VALUES (?,?,?,?,?,?,?,?,?,?)");
  for (const a of alarms) ia.run(companyId, ...a);
}
