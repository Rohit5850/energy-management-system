import { NextResponse } from "next/server";
import { createAccount, emailOrUsernameExists } from "@/lib/db";
import { createSessionCookie } from "@/lib/session";

export const runtime = "nodejs";

export async function POST(request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { companyName, mode, username, email, password } = body;

    if (!companyName || !username || !email || !password) {
      return NextResponse.json({ ok: false, error: "Sabhi fields bharein." }, { status: 400 });
    }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(String(email))) {
      return NextResponse.json({ ok: false, error: "Sahi email daalein." }, { status: 400 });
    }
    if (String(password).length < 6) {
      return NextResponse.json({ ok: false, error: "Password kam se kam 6 characters ka ho." }, { status: 400 });
    }
    const m = ["local", "cloud", "hybrid"].includes(mode) ? mode : "hybrid";

    if (emailOrUsernameExists(username, email)) {
      return NextResponse.json({ ok: false, error: "Ye username ya email pehle se registered hai." }, { status: 409 });
    }

    const { userId } = createAccount({ companyName, mode: m, username, email, password });
    const cookie = createSessionCookie({ id: userId, role: "admin", company_mode: m });
    const res = NextResponse.json({ ok: true, mode: m });
    res.cookies.set(cookie.name, cookie.value, cookie.options);
    return res;
  } catch (err) {
    // surface the real reason instead of a generic 500
    return NextResponse.json({ ok: false, error: "Server error: " + (err?.message || String(err)) }, { status: 500 });
  }
}
