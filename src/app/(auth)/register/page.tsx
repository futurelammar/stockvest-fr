"use client";

import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Eye, EyeOff, Loader2, MailCheck, ArrowUpRight } from "lucide-react";
import { useState } from "react";

import { AuthShell } from "@/components/auth/auth-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRegister, useResendVerification } from "@/hooks/use-auth";
import { registerSchema, type RegisterFormValues } from "@/lib/validators/auth.schema";

const inputClass =
  "h-11 rounded-lg border-[#D6D0C4] bg-white text-[#0E1A17] placeholder:text-[#B0AAA0] focus-visible:ring-[#1F6F4F]";

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const registerUser = useRegister();
  const resend = useResendVerification();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({ resolver: zodResolver(registerSchema) });

  const onSubmit = (values: RegisterFormValues) => registerUser.mutate(values);

  if (registerUser.isSuccess) {
    const email = registerUser.data?.email;
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0E1A17] px-4">
        <div className="w-full max-w-md space-y-6 rounded-2xl border border-white/10 bg-white/5 p-10 text-center backdrop-blur-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/10 ring-1 ring-emerald-500/30">
            <MailCheck className="h-7 w-7 text-emerald-400" />
          </div>
          <div className="space-y-2">
            <h2 className="font-display text-2xl font-semibold text-white">Check your inbox</h2>
            <p className="text-sm leading-relaxed text-white/50">
              We sent a verification link to <span className="font-medium text-emerald-400">{email}</span>. Click
              it to activate your account, then come back to sign in.
            </p>
          </div>
          <Button
            variant="outline"
            className="w-full border-white/20 text-white hover:bg-white/10"
            disabled={resend.isPending}
            onClick={() => email && resend.mutate(email)}
          >
            {resend.isPending ? "Sending…" : "Resend verification email"}
          </Button>
          <Link href="/login" className="block text-sm text-emerald-400 underline-offset-4 hover:underline">
            Back to sign in
          </Link>
        </div>
      </div>
    );
  }

  return (
    <AuthShell
      eyebrow="Open an account"
      title={
        <>
          Stock plans, funded,
          <br />
          reconciled
          <br />
          like a AutoBull
        </>
      }
      subtitle="Set minimums and maximums per plan, track maturity dates, and withdraw on your terms — all in one dashboard."
    >
      <div className="mb-8 space-y-1.5">
        <h2 className="font-display text-3xl font-bold tracking-tight text-[#0E1A17]">Create your account</h2>
        <p className="text-sm text-[#5B6661]">
          Already a member?{" "}
          <Link href="/login" className="font-medium text-[#1F6F4F] underline-offset-4 hover:underline">
            Sign in
          </Link>
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="space-y-1.5">
          <Label htmlFor="fullName" className="text-sm font-medium text-[#0E1A17]">
            Full name
          </Label>
          <Input id="fullName" placeholder="Caesar Okeke" autoComplete="name" className={inputClass} {...register("fullName")} />
          {errors.fullName && <p className="text-xs text-destructive">{errors.fullName.message}</p>}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="email" className="text-sm font-medium text-[#0E1A17]">
            Email address
          </Label>
          <Input id="email" type="email" placeholder="you@example.com" autoComplete="email" className={inputClass} {...register("email")} />
          {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="phone" className="text-sm font-medium text-[#0E1A17]">
            Phone number <span className="font-normal text-[#5B6661]">(optional)</span>
          </Label>
          <Input id="phone" placeholder="+234 801 234 5678" autoComplete="tel" className={inputClass} {...register("phone")} />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="password" className="text-sm font-medium text-[#0E1A17]">
            Password
          </Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
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
          {errors.password ? (
            <p className="text-xs text-destructive">{errors.password.message}</p>
          ) : (
            <p className="text-xs text-[#5B6661]">At least 8 characters, with a number and an uppercase letter.</p>
          )}
        </div>

        <Button
          type="submit"
          disabled={registerUser.isPending}
          className="mt-2 h-12 w-full rounded-lg bg-[#1F6F4F] text-base font-semibold text-white shadow-md transition-all hover:bg-[#186040] active:scale-[0.98] disabled:opacity-60"
        >
          {registerUser.isPending ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" /> Creating account…
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              Create account <ArrowUpRight className="h-4 w-4" />
            </span>
          )}
        </Button>

        <p className="text-center text-xs text-[#5B6661]">
          By continuing, you agree to our{" "}
          <Link href="/terms" className="underline underline-offset-2 hover:text-[#0E1A17]">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link href="/privacy" className="underline underline-offset-2 hover:text-[#0E1A17]">
            Privacy Policy
          </Link>
          .
        </p>
      </form>
    </AuthShell>
  );
}