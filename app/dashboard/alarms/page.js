import { getCurrentUser } from "@/lib/session";
import { getAlarms } from "@/lib/db";
import AlarmsClient from "@/components/dashboard/AlarmsClient";

export const dynamic = "force-dynamic";

export default function Alarms() {
  const user = getCurrentUser();
  const alarms = getAlarms(user.company_id);
  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-[22px] font-bold">Alarm center</h1>
        <span className="text-[13px] text-muted">Notify: WhatsApp · SMS · Hooter</span>
      </div>
      <AlarmsClient initial={alarms} />
    </>
  );
}
