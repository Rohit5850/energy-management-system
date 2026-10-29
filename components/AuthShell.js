// Shared left brand panel + right form card for all auth pages.
export default function AuthShell({ title, subtitle, children }) {
  return (
    <div className="flex min-h-screen flex-wrap bg-neutral-50 text-ink">
      <section className="flex flex-1 basis-[520px] flex-col justify-between gap-12 bg-[#0f1b16] px-10 py-14 text-[#e4ece7] sm:px-16">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2 3 14h7l-1 8 10-12h-7l1-8z" /></svg>
          </span>
          <div>
            <div className="text-xl font-extrabold tracking-tight">EnerVue</div>
            <div className="-mt-0.5 text-[13px] text-[#9fb3a8]">Energy Management Platform</div>
          </div>
        </div>
        <div className="max-w-md">
          <h1 className="mb-4 text-[34px] font-bold leading-tight tracking-tight">Har plant ki energy, ek jagah — local ho ya cloud.</h1>
          <p className="text-[15px] leading-relaxed text-[#b9c8c0]">Meters se live data, baseline, alarms aur savings — chahe sab plant ke andar chale, ya kahin se bhi cloud par.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {["Modbus TCP / RTU", "ISO 50001 reports", "Local · Cloud · Hybrid"].map((t) => (
            <span key={t} className="rounded-full border border-[#2c3d35] px-3.5 py-1.5 text-[13px] text-[#cfdcd5]">{t}</span>
          ))}
        </div>
      </section>

      <section className="flex flex-1 basis-[480px] items-center justify-center px-6 py-12">
        <div className="w-full max-w-[420px] rounded-2xl border border-line bg-white p-10">
          <h2 className="mb-1 text-2xl font-bold">{title}</h2>
          {subtitle && <p className="mb-6 text-sm text-muted">{subtitle}</p>}
          {children}
        </div>
      </section>
    </div>
  );
}
