"use client";

import { useState } from "react";
import Link from "next/link";
import AuthShell from "@/components/AuthShell";

const MODES = [
  { k: "local", label: "Local", hint: "Sab plant ke andar — internet nahi chahiye." },
  { k: "cloud", label: "Cloud", hint: "Aapke cloud par — kahin se bhi access." },
  { k: "hybrid", label: "Hybrid", hint: "Local chale + cloud par sync — dono." },
];

export default function RegisterPage() {
  const [f, setF] = useState({ companyName: "", username: "", email: "", password: "" });
  const [mode, setMode] = useState("hybrid");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const set = (k) => (e) => setF((s) => ({ ...s, [k]: e.target.value }));

  async function onSubmit(e) {
    e.preventDefault();
    setErr(""); setBusy(true);
    try {
      const r = await fetch("/api/auth/register", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...f, mode }),
      });
      const d = await r.json();
      if (d.ok) { window.location.href = "/dashboard"; return; }
      setErr(d.error || "Registration failed.");
    } catch (e2) { setErr("Server tak nahi pahunch paaye."); }
    setBusy(false);
  }

  const inp = "h-11 rounded-lg border border-[#c9d2cc] px-3 text-[15px] outline-none focus:border-brand focus:ring-4 focus:ring-brand-soft";

  return (
    <AuthShell title="Create account" subtitle="Company + deployment mode choose karein.">
      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        {err && <div className="rounded-lg bg-danger-soft px-3 py-2 text-sm text-danger">{err}</div>}

        <div className="flex flex-col gap-1.5">
          <span className="text-sm font-semibold text-ink2">Deployment mode</span>
          <div className="flex gap-1.5" role="group" aria-label="Deployment mode">
            {MODES.map((m) => (
              <button key={m.k} type="button" onClick={() => setMode(m.k)}
                className={`flex-1 rounded-lg border px-2 py-2.5 text-sm font-semibold transition ${mode === m.k ? "border-brand bg-brand-soft text-brand-ink" : "border-[#c9d2cc] bg-white text-ink2"}`}>
                {m.label}
              </button>
            ))}
          </div>
          <span className="text-xs text-muted">{MODES.find((m) => m.k === mode).hint}</span>
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="co" className="text-sm font-semibold text-ink2">Company / plant name</label>
          <input id="co" value={f.companyName} onChange={set("companyName")} className={inp} />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="un" className="text-sm font-semibold text-ink2">Username</label>
          <input id="un" value={f.username} onChange={set("username")} autoComplete="username" className={inp} />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="em" className="text-sm font-semibold text-ink2">Email</label>
          <input id="em" type="email" value={f.email} onChange={set("email")} autoComplete="email" className={inp} />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="pw" className="text-sm font-semibold text-ink2">Password</label>
          <input id="pw" type="password" value={f.password} onChange={set("password")} autoComplete="new-password" className={inp} />
          <span className="text-xs text-muted">Kam se kam 6 characters.</span>
        </div>

        <button type="submit" disabled={busy}
          className="mt-1 h-12 rounded-lg bg-brand text-[15px] font-bold text-white transition hover:bg-brand-ink disabled:opacity-60">
          {busy ? "Creating…" : "Create account"}
        </button>
        <p className="text-center text-sm text-muted">
          Pehle se account? <Link href="/login" className="font-semibold text-brand-ink hover:underline">Sign in</Link>
        </p>
      </form>
    </AuthShell>
  );
}
