"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  adminApi,
  saveAdminToken,
  clearAdminToken,
  getAdminToken,
} from "@/lib/admin-api";
import type { AdminLoginDto, AdminLoginResponse, AdminUser } from "@/types/admin";

/* ─── Login ────────────────────────────────────────────────────── */
export function useAdminLogin() {
  const router = useRouter();

  return useMutation<AdminLoginResponse, Error, AdminLoginDto>({
    mutationFn: async (dto) => {
      const { data } = await adminApi.post<AdminLoginResponse>(
        "/admin/auth/login",
        dto
      );
      return data;
    },
    onSuccess: (data) => {
      // Write token to cookie BEFORE navigating — middleware reads it on the
      // next request so the protected route is immediately accessible.
      saveAdminToken(data.accessToken);
      toast.success(`Welcome back, ${data.user.fullName}`);
      // Small delay lets the cookie propagate before the router triggers
      // a middleware check.
      setTimeout(() => router.replace("/admin/dashboard"), 100);
    },
    onError: (err: any) => {
      toast.error(
        err?.response?.data?.message ?? "Invalid credentials. Please try again."
      );
    },
  });
}

/* ─── Current admin — decoded from cookie JWT (no API call) ────── */
export function useAdminUser(): AdminUser | null {
  // Read token from the cookie (client-side only)
  const token = getAdminToken();
  if (!token) return null;

  try {
    // JWT payload is the middle segment, base64url-encoded
    const base64 = token.split(".")[1];
    if (!base64) return null;

    // base64url → base64 → JSON
    const json = atob(base64.replace(/-/g, "+").replace(/_/g, "/"));
    const payload = JSON.parse(json);

    // Treat as expired if exp claim is in the past
    if (payload.exp && payload.exp * 1000 < Date.now()) {
      clearAdminToken();
      return null;
    }

    return {
      id:       payload.sub   ?? "",
      email:    payload.email ?? "",
      role:     payload.role  ?? "admin",
      fullName: payload.fullName ?? payload.name ?? "",
    };
  } catch {
    // Malformed token — clear it
    clearAdminToken();
    return null;
  }
}

/* ─── Logout ────────────────────────────────────────────────────── */
export function useAdminLogout() {
  const router = useRouter();

  return () => {
    clearAdminToken();
    toast.success("Signed out.");
    router.push("/admin/login");
  };
}