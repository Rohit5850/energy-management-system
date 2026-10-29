// Server-side session helpers: read/set the auth cookie, get the current user.
import { cookies } from "next/headers";
import { signToken, verifyToken } from "./crypto";
import { getUserById } from "./db";

const COOKIE = "ems_session";
const SECRET = process.env.SESSION_SECRET || "dev-insecure-secret-change-me";

export function createSessionCookie(user) {
  const token = signToken(
    { uid: user.id, role: user.role, mode: user.company_mode },
    SECRET
  );
  return {
    name: COOKIE,
    value: token,
    options: {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    },
  };
}

export function clearSessionCookie() {
  return { name: COOKIE, value: "", options: { httpOnly: true, path: "/", maxAge: 0 } };
}

// For server components: returns the full user row, or null.
export function getCurrentUser() {
  try {
    const token = cookies().get(COOKIE)?.value;
    if (!token) return null;
    const payload = verifyToken(token, SECRET);
    if (!payload) return null;
    const user = getUserById(payload.uid);
    if (!user) return null;
    const { password_hash, ...safe } = user;
    return safe;
  } catch (e) {
    return null;
  }
}
