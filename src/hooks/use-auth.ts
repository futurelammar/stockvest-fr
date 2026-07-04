"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { api } from "@/lib/api";
import type { LoginFormValues, RegisterFormValues } from "@/lib/validators/auth.schema";
import type { AuthUser, LoginResponse, RegisterResponse } from "@/types/auth";

// Single source of truth for "who's logged in" — no client-side storage at all.
export function useCurrentUser() {
  return useQuery({
    queryKey: ["currentUser"],
    queryFn: async () => {
      const { data } = await api.get<AuthUser>("/users/me");
      return data;
    },
    retry: false,
    staleTime: 5 * 60 * 1000,
  });
}

export function useLogin() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (values: LoginFormValues) => {
      const { data } = await api.post<LoginResponse>("/auth/login", values);
      return data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["currentUser"], data.user);
      toast.success(`Welcome back, ${data.user.fullName.split(" ")[0]}`);
      router.push("/dashboard");
    },
    onError: (error: any) => {
      const status = error?.response?.status;
      const message = error?.response?.data?.message;
      if (status === 403 && typeof message === "string" && message.toLowerCase().includes("verify")) {
        toast.error("Please verify your email before logging in.");
      } else {
        toast.error(message || "Invalid email or password.");
      }
    },
  });
}

export function useRegister() {
  return useMutation({
    mutationFn: async (values: RegisterFormValues) => {
      const { data } = await api.post<RegisterResponse>("/auth/register", values);
      return data;
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Could not create your account.");
    },
  });
}

export function useLogout() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      await api.post("/auth/logout");
    },
    onSuccess: () => {
      queryClient.clear();
      router.push("/login");
    },
  });
}

export function useResendVerification() {
  return useMutation({
    mutationFn: async (email: string) => {
      const { data } = await api.post("/auth/resend-verification", { email });
      return data;
    },
    onSuccess: () => toast.success("Verification email sent."),
    onError: (error: any) => toast.error(error?.response?.data?.message || "Could not resend email."),
  });
}

export function useVerifyEmail() {
  return useMutation({
    mutationFn: async (token: string) => {
      const { data } = await api.post("/auth/verify-email", { token });
      return data;
    },
  });
}


export function useForgotPassword() {
  return useMutation({
    mutationFn: async (email: string) => {
      const { data } = await api.post("/auth/forgot-password", { email });
      return data;
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Could not send reset email.");
    },
  });
}

export function useResetPassword() {
  return useMutation({
    mutationFn: async ({ token, newPassword }: { token: string; newPassword: string }) => {
      const { data } = await api.post("/auth/reset-password", { token, newPassword });
      return data;
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Could not reset password.");
    },
  });
}