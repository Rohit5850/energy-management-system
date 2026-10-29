import { NextResponse } from "next/server";
import { consumeReset } from "@/lib/db";

export const runtime = "nodejs";

export async function POST(request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { token, password } = body;
    if (!token || !password) {
      return NextResponse.json({ ok: false, error: "Token aur naya password chahiye." }, { status: 400 });
    }
    if (String(password).length < 6) {
      return NextResponse.json({ ok: false, error: "Password kam se kam 6 characters ka ho." }, { status: 400 });
    }
    const r = consumeReset(String(token).trim(), password);
    if (!r.ok) return NextResponse.json({ ok: false, error: r.error }, { status: 400 });
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ ok: false, error: "Server error: " + (err?.message || String(err)) }, { status: 500 });
  }
}
