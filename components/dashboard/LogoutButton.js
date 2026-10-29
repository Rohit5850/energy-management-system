"use client";

export default function LogoutButton() {
  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/login";
  }
  return (
    <button onClick={logout}
      className="h-9 rounded-lg border border-line bg-white px-3 text-sm font-semibold text-ink2 hover:bg-neutral-50">
      Sign out
    </button>
  );
}
