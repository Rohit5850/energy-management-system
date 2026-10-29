import { NextResponse } from "next/server";
import { findUserByLogin } from "@/lib/db";
import { verifyPassword } from "@/lib/crypto";
import { createSessionCookie } from "@/lib/session";

export const runtime = "nodejs";

export async function POST(request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { login, password } = body;
    if (!login || !password) {
      return NextResponse.json({ ok: false, error: "Username/email aur password daalein." }, { status: 400 });
    }
    const user = findUserByLogin(String(login).trim());
    if (!user || !verifyPassword(password, user.password_hash)) {
      return NextResponse.json({ ok: false, error: "Galat username/email ya password." }, { status: 401 });
    }
    const cookie = createSessionCookie(user);
    const res = NextResponse.json({ ok: true, mode: user.company_mode });
    res.cookies.set(cookie.name, cookie.value, cookie.options);
    return res;
  } catch (err) {
    return NextResponse.json({ ok: false, error: "Server error: " + (err?.message || String(err)) }, { status: 500 });
  }
}
