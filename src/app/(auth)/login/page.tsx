"use client";

import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Eye, EyeOff, Loader2, ArrowUpRight } from "lucide-react";
import { useState } from "react";

import { AuthShell } from "@/components/auth/auth-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLogin, useResendVerification } from "@/hooks/use-auth";
import { loginSchema, type LoginFormValues } from "@/lib/validators/auth.schema";

const inputClass =
  "h-11 rounded-lg border-[#D6D0C4] bg-white text-[#0E1A17] placeholder:text-[#B0AAA0] focus-visible:ring-[#1F6F4F]";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const login = useLogin();
  const resend = useResendVerification();

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<LoginFormValues>({ resolver: zodResolver(loginSchema) });

  const onSubmit = (values: LoginFormValues) => login.mutate(values);

  const unverified =
    (login.error as any)?.response?.status === 403 &&
    (login.error as any)?.response?.data?.message?.toLowerCase().includes("verify");

  return (
    <AuthShell
      eyebrow="Member access"
      title={
        <>
          Capital, reviewed by hand
          <br />
          and grown <span className="text-emerald-400">on discipline.</span>
        </>
      }
      subtitle="Sign in to track active positions, review maturity dates, and move funds in or out of your account."
    >
      <div className="mb-8 space-y-1.5">
        <h2 className="font-display text-3xl font-bold tracking-tight text-[#0E1A17]">Welcome back</h2>
        <p className="text-sm text-[#5B6661]">
          New here?{" "}
          <Link href="/register" className="font-medium text-[#1F6F4F] underline-offset-4 hover:underline">
            Create an account
          </Link>
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="space-y-1.5">
          <Label htmlFor="email" className="text-sm font-medium text-[#0E1A17]">
            Email address
          </Label>
          <Input id="email" type="email" placeholder="you@example.com" autoComplete="email" className={inputClass} {...register("email")} />
          {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="password" className="text-sm font-medium text-[#0E1A17]">
              Password
            </Label>
            <Link href="/forgot-password" className="text-xs text-[#5B6661] hover:text-[#1F6F4F]">
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              className={`${inputClass} pr-10`}
              {...register("password")}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#B0AAA0] transition-colors hover:text-[#0E1A17]"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
        </div>

        {unverified && (
          <div className="rounded-lg border border-[#C9A24B]/40 bg-[#C9A24B]/10 px-3 py-2.5 text-sm">
            <p className="text-[#0E1A17]">Your email isn&apos;t verified yet.</p>
            <button
              type="button"
              onClick={() => resend.mutate(getValues("email"))}
              disabled={resend.isPending}
              className="mt-1 font-medium text-[#1F6F4F] underline-offset-4 hover:underline disabled:opacity-50"
            >
              {resend.isPending ? "Sending…" : "Resend verification email"}
            </button>
          </div>
        )}

        <Button
          type="submit"
          disabled={login.isPending}
          className="mt-2 h-12 w-full rounded-lg bg-[#1F6F4F] text-base font-semibold text-white shadow-md transition-all hover:bg-[#186040] active:scale-[0.98] disabled:opacity-60"
        >
          {login.isPending ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" /> Signing in…
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              Sign in <ArrowUpRight className="h-4 w-4" />
            </span>
          )}
        </Button>
      </form>
    </AuthShell>
  );
}