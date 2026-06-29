"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Loader2 } from "lucide-react";
import { getAdminToken, clearAdminToken } from "@/lib/admin-api";
import { AdminShell } from "@/components/admin/admin-shell";
import type { AdminUser } from "@/types/admin";

/** Decode the JWT payload from the admin cookie — no network request needed. */
function decodeAdminToken(token: string): AdminUser | null {
  try {
    const base64 = token.split(".")[1];
    if (!base64) return null;

    // base64url → base64 (replace URL-safe chars) → JSON string
    const json = atob(base64.replace(/-/g, "+").replace(/_/g, "/"));
    const payload = JSON.parse(json);

    // Reject expired tokens immediately
    if (payload.exp && payload.exp * 1000 < Date.now()) {
      return null;
    }

    return {
      id:       payload.sub      ?? "",
      email:    payload.email    ?? "",
      role:     payload.role     ?? "admin",
      fullName: payload.fullName ?? payload.name ?? "",
    };
  } catch {
    return null;
  }
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router    = useRouter();
  const pathname  = usePathname();
  const isLoginPage = pathname === "/admin/login";

  const [user,     setUser]     = useState<AdminUser | null>(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const token = getAdminToken();

    if (!token) {
      // No cookie at all — send to login unless already there
      if (!isLoginPage) router.replace("/admin/login");
      setChecking(false);
      return;
    }

    const decoded = decodeAdminToken(token);

    if (!decoded) {
      // Token present but expired or malformed — clean up and redirect
      clearAdminToken();
      if (!isLoginPage) router.replace("/admin/login");
      setChecking(false);
      return;
    }

    // Token is valid — set user and handle login page redirect
    setUser(decoded);
    if (isLoginPage) router.replace("/admin/dashboard");
    setChecking(false);
  }, [pathname, isLoginPage, router]);

  // ── Loading spinner while cookie is being read ──
  if (checking) {
    return (
      <div
        style={{
          display: "flex",
          minHeight: "100vh",
          alignItems: "center",
          justifyContent: "center",
          background: "#0a0f1a",
        }}
      >
        <Loader2
          size={24}
          color="#f59e0b"
          style={{ animation: "spin 1s linear infinite" }}
        />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  // ── Login page — render without shell ──
  if (isLoginPage) {
    return <>{children}</>;
  }

  // ── No valid user after check — render nothing (redirect already fired) ──
  if (!user) return null;

  // ── Authenticated — wrap in AdminShell ──
  return <AdminShell user={user}>{children}</AdminShell>;
}