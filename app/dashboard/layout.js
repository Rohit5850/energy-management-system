import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import Sidebar from "@/components/dashboard/Sidebar";
import LogoutButton from "@/components/dashboard/LogoutButton";

export const dynamic = "force-dynamic";

const MODE_LABEL = {
  local: "Local · offline",
  cloud: "Cloud · online",
  hybrid: "Hybrid · synced",
};

export default function DashboardLayout({ children }) {
  const user = getCurrentUser();
  if (!user) redirect("/login");
  const mode = user.company_mode || "hybrid";

  return (
    <div className="flex min-h-screen flex-wrap bg-neutral-50 text-ink">
      <Sidebar />
      <div className="flex min-w-0 flex-[999] basis-[560px] flex-col">
        <header className="flex flex-wrap items-center gap-4 border-b border-line bg-white px-8 py-3.5">
          <div className="min-w-0 flex-1 basis-[240px]">
            <div className="text-xs text-muted">{user.company_name} · Unit 1</div>
            <div className="text-sm font-semibold text-ink2">Signed in as {user.username} ({user.role})</div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-2 rounded-full bg-brand-soft px-3 py-1.5 text-[13px] font-semibold text-brand-ink">
              <span className="h-2 w-2 rounded-full bg-brand" />
              {MODE_LABEL[mode]}
            </span>
            <LogoutButton />
          </div>
        </header>
        <main className="flex flex-col gap-5 px-8 pb-12 pt-6">{children}</main>
      </div>
    </div>
  );
}
