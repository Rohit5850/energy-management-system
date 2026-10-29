"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const EMPTY = { name: "", tag: "", measures: "", live: "", address: "", status: "ok", lvl: false };

export default function DevicesClient({ initial }) {
  const router = useRouter();
  const [meters, setMeters] = useState(initial || []);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  function upd(k, v) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  async function addDevice(e) {
    e.preventDefault();
    setError("");
    if (!form.name.trim()) {
      setError("Device ka naam daalein.");
      return;
    }
    setBusy(true);
    try {
      const res = await fetch("/api/meters", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!data.ok) {
        setError(data.error || "Add nahi hua.");
      } else {
        setMeters((m) => [...m, { id: data.id, company_id: 0, ...form, status: form.status, lvl: form.lvl ? 1 : 0, live: form.live || "—" }]);
        setForm(EMPTY);
        setOpen(false);
        router.refresh();
      }
    } catch (err) {
      setError("Server tak nahi pahunch paaye.");
    } finally {
      setBusy(false);
    }
  }

  async function removeDevice(id) {
    if (!confirm("Ye device hata dein?")) return;
    try {
      const res = await fetch("/api/meters?id=" + id, { method: "DELETE" });
      const data = await res.json();
      if (data.ok) {
        setMeters((m) => m.filter((x) => x.id !== id));
        router.refresh();
      }
    } catch (err) {
      /* ignore */
    }
  }

  return (
    <section className="overflow-hidden rounded-xl border border-line bg-white">
      <div className="flex flex-wrap items-center justify-between gap-2 px-6 pb-2 pt-5">
        <h2 className="text-[17px] font-bold">Meter hierarchy</h2>
        <div className="flex items-center gap-3">
          <span className="text-[13px] text-muted">live values · 1-min</span>
          <button
            onClick={() => { setOpen((o) => !o); setError(""); }}
            className="rounded-lg bg-brand px-3.5 py-1.5 text-sm font-semibold text-white hover:opacity-90"
          >
            {open ? "Cancel" : "+ Add device"}
          </button>
        </div>
      </div>

      {open && (
        <form onSubmit={addDevice} className="mx-6 mb-3 grid gap-3 rounded-xl border border-line bg-neutral-50 p-4 sm:grid-cols-2">
          <Field label="Device name *" value={form.name} onChange={(v) => upd("name", v)} placeholder="Chiller CH-03" />
          <Field label="Tag" value={form.tag} onChange={(v) => upd("tag", v)} placeholder="EM-09" />
          <Field label="Measures" value={form.measures} onChange={(v) => upd("measures", v)} placeholder="kW + BTU (TR)" />
          <Field label="Live value" value={form.live} onChange={(v) => upd("live", v)} placeholder="120 kW" />
          <Field label="Modbus address" value={form.address} onChange={(v) => upd("address", v)} placeholder="10 · 40001" />
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-muted">Status</label>
            <select
              value={form.status}
              onChange={(e) => upd("status", e.target.value)}
              className="rounded-lg border border-line bg-white px-3 py-2 text-sm"
            >
              <option value="ok">Online</option>
              <option value="warn">Alert</option>
            </select>
          </div>
          <label className="flex items-center gap-2 text-sm text-ink2 sm:col-span-2">
            <input type="checkbox" checked={form.lvl} onChange={(e) => upd("lvl", e.target.checked)} />
            Sub-meter (main incomer ke neeche dikhao)
          </label>

          {error && <p className="text-sm font-semibold text-red-600 sm:col-span-2">{error}</p>}

          <div className="sm:col-span-2">
            <button
              type="submit"
              disabled={busy}
              className="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-60"
            >
              {busy ? "Saving…" : "Save device"}
            </button>
          </div>
        </form>
      )}

      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] border-collapse text-sm">
          <thead>
            <tr className="bg-neutral-50 text-left text-xs uppercase tracking-wide text-muted">
              <th className="px-6 py-3 font-semibold">Point</th>
              <th className="px-2 py-3 font-semibold">Tag</th>
              <th className="px-2 py-3 font-semibold">Measures</th>
              <th className="px-2 py-3 text-right font-semibold">Live</th>
              <th className="px-2 py-3 font-semibold">Address</th>
              <th className="px-2 py-3 font-semibold">Status</th>
              <th className="px-6 py-3 font-semibold"></th>
            </tr>
          </thead>
          <tbody>
            {meters.length === 0 && (
              <tr><td colSpan={7} className="px-6 py-8 text-center text-muted">Abhi koi device nahi. "+ Add device" dabao.</td></tr>
            )}
            {meters.map((m) => (
              <tr key={m.id} className="border-t border-neutral-100">
                <td className="px-6 py-3"><span className={m.lvl ? "pl-4 text-ink2" : "font-bold"}>{m.name}</span></td>
                <td className="px-2 py-3 font-mono text-ink2">{m.tag}</td>
                <td className="px-2 py-3 text-ink2">{m.measures}</td>
                <td className="px-2 py-3 text-right font-mono font-semibold">{m.live}</td>
                <td className="px-2 py-3 font-mono text-muted">{m.address}</td>
                <td className="px-2 py-3">
                  <span className={`whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-semibold ${m.status === "ok" ? "bg-brand-soft text-brand-ink" : "bg-amber-soft text-amber"}`}>
                    {m.status === "ok" ? "Online" : "Alert"}
                  </span>
                </td>
                <td className="px-6 py-3 text-right">
                  <button onClick={() => removeDevice(m.id)} className="text-xs font-semibold text-red-600 hover:underline">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function Field({ label, value, onChange, placeholder }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-semibold text-muted">{label}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="rounded-lg border border-line bg-white px-3 py-2 text-sm outline-none focus:border-brand"
      />
    </div>
  );
}
