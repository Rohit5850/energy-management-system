"use client";

import { useState } from "react";
import Link from "next/link";
import AuthShell from "@/components/AuthShell";

export default function LoginPage() {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setErr(""); setBusy(true);
    try {
      const r = await fetch("/api/auth/login", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ login, password }),
      });
      const d = await r.json();
      if (d.ok) { window.location.href = "/dashboard"; return; }
      setErr(d.error || "Login failed.");
    } catch (e2) { setErr("Server tak nahi pahunch paaye."); }
    setBusy(false);
  }

  return (
    <AuthShell title="Sign in" subtitle="Apne plant ya company account se.">
      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        {err && <div className="rounded-lg bg-danger-soft px-3 py-2 text-sm text-danger">{err}</div>}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="login" className="text-sm font-semibold text-ink2">Username or email</label>
          <input id="login" value={login} onChange={(e) => setLogin(e.target.value)} autoComplete="username"
            className="h-11 rounded-lg border border-[#c9d2cc] px-3 text-[15px] outline-none focus:border-brand focus:ring-4 focus:ring-brand-soft" />
        </div>
        <div className="flex flex-col gap-1.5">
          <div className="flex items-baseline justify-between">
            <label htmlFor="pwd" className="text-sm font-semibold text-ink2">Password</label>
            <Link href="/forgot" className="text-[13px] font-semibold text-brand-ink hover:underline">Forgot password?</Link>
          </div>
          <input id="pwd" type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password"
            className="h-11 rounded-lg border border-[#c9d2cc] px-3 text-[15px] outline-none focus:border-brand focus:ring-4 focus:ring-brand-soft" />
        </div>
        <button type="submit" disabled={busy}
          className="mt-1 h-12 rounded-lg bg-brand text-[15px] font-bold text-white transition hover:bg-brand-ink disabled:opacity-60">
          {busy ? "Signing in…" : "Sign in"}
        </button>
        <p className="text-center text-sm text-muted">
          Naya account? <Link href="/register" className="font-semibold text-brand-ink hover:underline">Register</Link>
        </p>
      </form>
    </AuthShell>
  );
}
