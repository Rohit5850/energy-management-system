import { getCurrentUser } from "@/lib/session";
import { getMeters } from "@/lib/db";
import DevicesClient from "@/components/dashboard/DevicesClient";

export const dynamic = "force-dynamic";

export default function Devices() {
  const user = getCurrentUser();
  const meters = getMeters(user.company_id);
  const online = meters.filter((m) => m.status === "ok").length;

  return (
    <>
      <h1 className="text-[22px] font-bold">Devices &amp; meters</h1>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4">
        <div className="flex flex-col gap-1.5 rounded-xl bg-[#0f1b16] px-5 py-4 text-[#e4ece7]">
          <span className="text-[13px] text-[#9fb3a8]">Edge gateway</span>
          <span className="text-xl font-bold">GW-01 · Online</span>
          <span className="text-xs text-[#7cc7a3]">1 gateway · poore plant ke meters</span>
        </div>
        <Stat label="Meters" value={`${online} / ${meters.length}`} sub="online" subClass="text-brand-ink" />
        <Stat label="Protocol" value="Modbus" sub="TCP · RTU (RS-485)" />
        <Stat label="Data gaps (24h)" value="0" sub="buffer healthy" subClass="text-brand-ink" />
      </div>

      <DevicesClient initial={meters} />
    </>
  );
}

function Stat({ label, value, sub, subClass = "text-muted" }) {
  return (
    <div className="flex flex-col gap-1.5 rounded-xl border border-line bg-white px-5 py-4">
      <span className="text-[13px] text-muted">{label}</span>
      <span className="font-mono text-2xl font-bold">{value}</span>
      <span className={`text-[13px] font-semibold ${subClass}`}>{sub}</span>
    </div>
  );
}
