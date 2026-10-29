// Authentication crypto — uses Node's built-in crypto only (no external deps).
// Password hashing: scrypt with per-user salt.  Session token: HMAC-signed JSON.
import crypto from "crypto";

// ---- password hashing (scrypt) ----
export function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString("hex");
  const derived = crypto.scryptSync(String(password), salt, 64).toString("hex");
  return `scrypt:${salt}:${derived}`;
}

export function verifyPassword(password, stored) {
  try {
    const [scheme, salt, hash] = String(stored).split(":");
    if (scheme !== "scrypt" || !salt || !hash) return false;
    const derived = crypto.scryptSync(String(password), salt, 64).toString("hex");
    const a = Buffer.from(hash, "hex");
    const b = Buffer.from(derived, "hex");
    return a.length === b.length && crypto.timingSafeEqual(a, b);
  } catch (e) {
    return false;
  }
}

// ---- session token (HMAC-signed, like a minimal JWT) ----
function b64url(buf) {
  return Buffer.from(buf).toString("base64url");
}

export function signToken(payload, secret, maxAgeSec = 60 * 60 * 24 * 7) {
  const body = { ...payload, exp: Date.now() + maxAgeSec * 1000 };
  const data = b64url(JSON.stringify(body));
  const sig = crypto.createHmac("sha256", secret).update(data).digest("base64url");
  return `${data}.${sig}`;
}

export function verifyToken(token, secret) {
  try {
    if (!token || typeof token !== "string") return null;
    const [data, sig] = token.split(".");
    if (!data || !sig) return null;
    const expected = crypto.createHmac("sha256", secret).update(data).digest("base64url");
    const sa = Buffer.from(sig);
    const sb = Buffer.from(expected);
    if (sa.length !== sb.length || !crypto.timingSafeEqual(sa, sb)) return null;
    const payload = JSON.parse(Buffer.from(data, "base64url").toString("utf8"));
    if (!payload.exp || Date.now() > payload.exp) return null;
    return payload;
  } catch (e) {
    return null;
  }
}

// ---- random token for password reset ----
export function randomToken() {
  return crypto.randomBytes(24).toString("hex");
}
