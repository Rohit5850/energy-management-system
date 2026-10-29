"use client";

import { useState } from "react";

export default function AlarmsClient({ initial }) {
  const [acked, setAcked] = useState({});
  const open = initial.filter((a) => a.status === "open" && !acked[a.id]).length;

  const sevClass = (c) =>
    c === "crit" ? "bg-danger-soft text-danger" : c === "warn" ? "bg-amber-soft text-amber" : "bg-brand-soft text-brand-ink";

  return (
    <>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-4">
        <Stat label="Unacknowledged" value={String(open)} />
        <Stat label="Action level (24h)" value="1" />
        <Stat label="Avg ack time" value="7 min" />
        <Stat label="Escalated" value="0" />
      </div>

      <section className="overflow-hidden rounded-xl border border-line bg-white">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[840px] border-collapse text-sm">
            <thead>
              <tr className="bg-neutral-50 text-left text-xs uppercase tracking-wide text-muted">
                <th className="px-5 py-3 font-semibold">Severity</th><th className="px-2 py-3 font-semibold">Raised</th>
                <th className="px-2 py-3 font-semibold">Location</th><th className="px-2 py-3 font-semibold">Condition</th>
                <th className="px-2 py-3 text-right font-semibold">Value</th><th className="px-2 py-3 text-right font-semibold">Limit</th>
                <th className="px-5 py-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {initial.map((a) => {
                const isAck = acked[a.id] || a.status !== "open";
                return (
                  <tr key={a.id} className="border-t border-neutral-100 align-top">
                    <td className="px-5 py-3"><span className={`whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-semibold ${sevClass(a.sev_class)}`}>{a.severity}</span></td>
                    <td className="px-2 py-3 font-mono text-[13px]">{a.raised_at}</td>
                    <td className="px-2 py-3"><div className="font-medium">{a.location}</div><div className="text-xs text-muted">{a.area}</div></td>
                    <td className="px-2 py-3">{a.condition}</td>
                    <td className="px-2 py-3 text-right font-mono font-semibold">{a.value}</td>
                    <td className="px-2 py-3 text-right font-mono text-muted">{a.lim}</td>
                    <td className="px-5 py-2">
                      {isAck ? (
                        <span className="whitespace-nowrap text-[13px] font-medium text-brand-ink">✓ Acknowledged</span>
                      ) : (
                        <button onClick={() => setAcked((s) => ({ ...s, [a.id]: true }))}
                          className="min-h-[40px] whitespace-nowrap rounded-lg bg-brand px-3.5 text-[13px] font-semibold text-white hover:bg-brand-ink">
                          Acknowledge
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}

function Stat({ label, value }) {
  return (
    <div className="rounded-xl border border-line bg-white px-5 py-4">
      <div className="text-[13px] text-muted">{label}</div>
      <div className="font-mono text-[26px] font-bold">{value}</div>
    </div>
  );
}
