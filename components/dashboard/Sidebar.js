"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
  { h: "Monitor" },
  { href: "/dashboard", label: "Plant overview" },
  { href: "/dashboard/energy", label: "Energy analysis" },
  { href: "/dashboard/devices", label: "Devices & meters" },
  { href: "/dashboard/alarms", label: "Alarm center", badge: "3" },
  { h: "Compliance" },
  { href: "/dashboard/reports", label: "Reports" },
];

export default function Sidebar() {
  const path = usePathname();
  return (
    <nav aria-label="Main" className="flex basis-[236px] flex-col gap-0.5 bg-[#0f1b16] p-3 text-[#e4ece7] md:flex-1">
      <div className="flex items-center gap-2.5 px-2.5 pb-3.5 pt-1">
        <span className="flex h-[34px] w-[34px] items-center justify-center rounded-[9px] bg-brand">
          <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2 3 14h7l-1 8 10-12h-7l1-8z" /></svg>
        </span>
        <span className="text-lg font-extrabold">EnerVue</span>
      </div>
      {NAV.map((n, i) =>
        n.h ? (
          <div key={i} className="px-3 pb-1.5 pt-4 text-[11px] uppercase tracking-wider text-[#7f948a]">{n.h}</div>
        ) : (
          <Link key={n.href} href={n.href}
            className={`flex min-h-[40px] items-center justify-between rounded-lg px-3 text-sm no-underline ${path === n.href ? "bg-[#1c3328] font-semibold text-white" : "text-[#c3d2ca] hover:bg-[#162821]"}`}>
            <span>{n.label}</span>
            {n.badge && <span className="rounded-full bg-danger px-1.5 py-px text-[11px] font-semibold text-white">{n.badge}</span>}
          </Link>
        )
      )}
    </nav>
  );
}
