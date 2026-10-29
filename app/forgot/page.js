"use client";

import { useState } from "react";
import Link from "next/link";
import AuthShell from "@/components/AuthShell";

export default function ForgotPage() {
  const [login, setLogin] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [resetUrl, setResetUrl] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    setBusy(true);
    try {
      const r = await fetch("/api/auth/forgot", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ login }),
      });
      const d = await r.json();
      setDone(true);
      // dev convenience: real app emails this link
      if (d.resetToken) setResetUrl(`/reset?token=${d.resetToken}`);
    } catch (e2) {}
    setBusy(false);
  }

  return (
    <AuthShell title="Forgot password" subtitle="Username ya email daalein — reset link milega.">
      {done ? (
        <div className="flex flex-col gap-4">
          <div className="rounded-lg bg-brand-soft px-3 py-3 text-sm text-ink">
            Agar account hai to reset link bhej diya gaya hai.
          </div>
          {resetUrl && (
            <div className="rounded-lg border border-line bg-neutral-50 px-3 py-3 text-sm">
              <div className="mb-1 font-semibold text-ink2">Dev mode — reset link:</div>
              <Link href={resetUrl} className="break-all font-mono text-[13px] text-brand-ink hover:underline">{resetUrl}</Link>
              <p className="mt-2 text-xs text-muted">Real app mein ye link email par jaata hai.</p>
            </div>
          )}
          <Link href="/login" className="text-center text-sm font-semibold text-brand-ink hover:underline">Back to sign in</Link>
        </div>
      ) : (
        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="login" className="text-sm font-semibold text-ink2">Username or email</label>
            <input id="login" value={login} onChange={(e) => setLogin(e.target.value)}
              className="h-11 rounded-lg border border-[#c9d2cc] px-3 text-[15px] outline-none focus:border-brand focus:ring-4 focus:ring-brand-soft" />
          </div>
          <button type="submit" disabled={busy}
            className="h-12 rounded-lg bg-brand text-[15px] font-bold text-white transition hover:bg-brand-ink disabled:opacity-60">
            {busy ? "Sending…" : "Send reset link"}
          </button>
          <Link href="/login" className="text-center text-sm text-muted hover:underline">Back to sign in</Link>
        </form>
      )}
    </AuthShell>
  );
}
