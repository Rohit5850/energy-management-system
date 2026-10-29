import { NextResponse } from "next/server";
import { findUserByLogin, createReset } from "@/lib/db";

export const runtime = "nodejs";

export async function POST(request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { login } = body;
    if (!login) {
      return NextResponse.json({ ok: false, error: "Username ya email daalein." }, { status: 400 });
    }
    const user = findUserByLogin(String(login).trim());
    let resetToken = null;
    if (user) resetToken = createReset(user.id);
    return NextResponse.json({
      ok: true,
      message: "Agar account hai, to reset link bhej diya gaya.",
      resetToken, // dev-only: real app emails this instead
    });
  } catch (err) {
    return NextResponse.json({ ok: false, error: "Server error: " + (err?.message || String(err)) }, { status: 500 });
  }
}
