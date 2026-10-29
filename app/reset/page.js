"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import AuthShell from "@/components/AuthShell";

function ResetForm() {
  const params = useSearchParams();
  const [token, setToken] = useState(params.get("token") || "");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setErr(""); setBusy(true);
    try {
      const r = await fetch("/api/auth/reset", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const d = await r.json();
      if (d.ok) setDone(true);
      else setErr(d.error || "Reset failed.");
    } catch (e2) { setErr("Server tak nahi pahunch paaye."); }
    setBusy(false);
  }

  if (done) {
    return (
      <div className="flex flex-col gap-4">
        <div className="rounded-lg bg-brand-soft px-3 py-3 text-sm text-ink">Password badal gaya. Ab naye password se sign in karein.</div>
        <Link href="/login" className="h-12 rounded-lg bg-brand text-center text-[15px] font-bold leading-[48px] text-white hover:bg-brand-ink">Sign in</Link>
      </div>
    );
  }

  const inp = "h-11 rounded-lg border border-[#c9d2cc] px-3 text-[15px] outline-none focus:border-brand focus:ring-4 focus:ring-brand-soft";
  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      {err && <div className="rounded-lg bg-danger-soft px-3 py-2 text-sm text-danger">{err}</div>}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="tk" className="text-sm font-semibold text-ink2">Reset token</label>
        <input id="tk" value={token} onChange={(e) => setToken(e.target.value)} className={`${inp} font-mono text-[13px]`} />
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="np" className="text-sm font-semibold text-ink2">New password</label>
        <input id="np" type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="new-password" className={inp} />
        <span className="text-xs text-muted">Kam se kam 6 characters.</span>
      </div>
      <button type="submit" disabled={busy}
        className="h-12 rounded-lg bg-brand text-[15px] font-bold text-white transition hover:bg-brand-ink disabled:opacity-60">
        {busy ? "Saving…" : "Set new password"}
      </button>
    </form>
  );
}

export default function ResetPage() {
  return (
    <AuthShell title="Reset password" subtitle="Naya password set karein.">
      <Suspense fallback={<div className="text-sm text-muted">Loading…</div>}>
        <ResetForm />
      </Suspense>
    </AuthShell>
  );
}
