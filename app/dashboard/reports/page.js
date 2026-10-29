export const dynamic = "force-dynamic";

const REPORTS = [
  { name: "Monthly energy summary", desc: "Consumption, cost, SEC, savings", period: "Oct 2026" },
  { name: "ISO 50001 performance", desc: "Baseline, EnPI, SEUs, targets", period: "Oct 2026" },
  { name: "Demand & power factor", desc: "Peak demand, PF, penalties avoided", period: "Oct 2026" },
  { name: "Savings realised", desc: "Actions taken vs verified savings", period: "Q3 2026" },
  { name: "Carbon / ESG (Scope 2)", desc: "Emissions from grid energy", period: "Oct 2026" },
];

export default function Reports() {
  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-[22px] font-bold">Reports</h1>
        <span className="text-[13px] text-muted">Auto-generated · monthly</span>
      </div>

      <div className="flex flex-wrap items-start gap-5">
        <section className="min-w-0 flex-[2] basis-[460px] overflow-hidden rounded-xl border border-line bg-white">
          <div className="px-6 pb-2 pt-5"><h2 className="text-[17px] font-bold">Available reports</h2></div>
          {REPORTS.map((r) => (
            <div key={r.name} className="flex flex-wrap items-center gap-3.5 border-t border-neutral-100 px-6 py-4">
              <div className="min-w-0 flex-1 basis-[220px]">
                <div className="text-[15px] font-semibold">{r.name}</div>
                <div className="text-[12.5px] text-muted">{r.desc}</div>
              </div>
              <span className="font-mono text-xs text-muted">{r.period}</span>
              <button className="min-h-[38px] rounded-lg border border-line bg-white px-3.5 text-[13px] hover:bg-neutral-50">Download PDF</button>
            </div>
          ))}
        </section>

        <section className="flex min-w-0 flex-1 basis-[320px] flex-col gap-4 rounded-xl border border-line bg-white px-6 py-5">
          <div>
            <div className="text-xs text-muted">ISO 50001 · October 2026</div>
            <h2 className="mt-0.5 text-lg font-bold">Monthly energy summary</h2>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Tile label="Total energy" value="548 MWh" />
            <Tile label="vs baseline" value="−8.1%" valClass="text-brand-ink" />
            <Tile label="Cost saved" value="₹3.8L" valClass="text-brand-ink" />
            <Tile label="CO₂" value="92 t" />
          </div>
          <div className="flex flex-col gap-2 border-t border-neutral-100 pt-3.5 text-[13px] text-ink2">
            <Row k="SEC (kWh/batch)" v="412" />
            <Row k="Peak demand" v="1,980 kVA" />
            <Row k="Power factor (avg)" v="0.97" />
          </div>
          <button className="min-h-[46px] rounded-lg bg-brand text-[15px] font-bold text-white hover:bg-brand-ink">Download signed PDF</button>
        </section>
      </div>
    </>
  );
}

function Tile({ label, value, valClass = "" }) {
  return (
    <div className="rounded-lg bg-neutral-50 px-3.5 py-3">
      <div className="text-xs text-muted">{label}</div>
      <div className={`font-mono text-[19px] font-bold ${valClass}`}>{value}</div>
    </div>
  );
}
function Row({ k, v }) {
  return <div className="flex justify-between gap-2"><span className="text-muted">{k}</span><span className="font-mono">{v}</span></div>;
}
