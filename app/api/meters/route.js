import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/session";
import { addMeter, deleteMeter, getMeters } from "@/lib/db";

export const runtime = "nodejs";

// list current company's meters
export async function GET() {
  try {
    const user = getCurrentUser();
    if (!user) return NextResponse.json({ ok: false, error: "Not logged in." }, { status: 401 });
    return NextResponse.json({ ok: true, meters: getMeters(user.company_id) });
  } catch (err) {
    return NextResponse.json({ ok: false, error: "Server error: " + (err?.message || String(err)) }, { status: 500 });
  }
}

// add a new device/meter
export async function POST(request) {
  try {
    const user = getCurrentUser();
    if (!user) return NextResponse.json({ ok: false, error: "Not logged in." }, { status: 401 });

    const body = await request.json().catch(() => ({}));
    if (!body.name || !String(body.name).trim()) {
      return NextResponse.json({ ok: false, error: "Device ka naam daalein." }, { status: 400 });
    }
    const id = addMeter(user.company_id, {
      name: String(body.name).trim(),
      tag: String(body.tag || "").trim(),
      measures: String(body.measures || "").trim(),
      live: String(body.live || "—").trim(),
      address: String(body.address || "").trim(),
      status: body.status,
      lvl: body.lvl,
    });
    return NextResponse.json({ ok: true, id });
  } catch (err) {
    return NextResponse.json({ ok: false, error: "Server error: " + (err?.message || String(err)) }, { status: 500 });
  }
}

// delete a device/meter  (/api/meters?id=5)
export async function DELETE(request) {
  try {
    const user = getCurrentUser();
    if (!user) return NextResponse.json({ ok: false, error: "Not logged in." }, { status: 401 });
    const id = new URL(request.url).searchParams.get("id");
    if (!id) return NextResponse.json({ ok: false, error: "id chahiye." }, { status: 400 });
    deleteMeter(user.company_id, id);
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ ok: false, error: "Server error: " + (err?.message || String(err)) }, { status: 500 });
  }
}
