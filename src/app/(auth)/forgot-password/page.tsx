"use client";

import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Loader2, ArrowUpRight, MailCheck, ArrowLeft } from "lucide-react";
import { AuthShell } from "@/components/auth/auth-shell";
import { useForgotPassword } from "@/hooks/use-auth";
import { forgotPasswordSchema, type ForgotPasswordFormValues } from "@/lib/validators/auth.schema";

const inputClass =
  "w-full rounded-lg border border-[#D6D0C4] bg-white px-3 py-2.5 text-sm text-[#0E1A17] outline-none focus:border-[#C0392B] placeholder:text-[#B0AAA0]";

export default function ForgotPasswordPage() {
  const forgotPassword = useForgotPassword();

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = (values: ForgotPasswordFormValues) =>
    forgotPassword.mutate(values.email);

  if (forgotPassword.isSuccess) {
    return (
      <AuthShell
        eyebrow="Password recovery"
        title={
          <>
            Check your<br />
            <span style={{ color: "#C0392B" }}>inbox.</span>
          </>
        }
        subtitle="We sent a reset link to your email address. It expires in 1 hour."
      >
        <div className="space-y-6">
          <div
            style={{
              width: "52px",
              height: "52px",
              borderRadius: "12px",
              background: "rgba(192,57,43,0.12)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <MailCheck size={24} color="#C0392B" />
          </div>

          <div className="space-y-2">
            <h2
              style={{
                fontFamily: "var(--font-display, sans-serif)",
                fontSize: "26px",
                fontWeight: 700,
                color: "#0D0D0D",
                letterSpacing: "-0.01em",
              }}
            >
              Email sent
            </h2>
            <p style={{ fontSize: "14px", color: "#5B6661", lineHeight: 1.6 }}>
              We sent a password reset link to{" "}
              <span style={{ fontWeight: 600, color: "#0D0D0D" }}>{getValues("email")}</span>.
              Click the link in the email to set a new password.
            </p>
          </div>

          <div
            style={{
              background: "#FDF6EC",
              border: "1px solid rgba(243,156,18,0.3)",
              borderRadius: "10px",
              padding: "14px 16px",
              fontSize: "13px",
              color: "#92620A",
              lineHeight: 1.55,
            }}
          >
            <strong>Didn't receive it?</strong> Check your spam folder, or wait a minute and try again. The link expires in <strong>1 hour</strong>.
          </div>

          <button
            onClick={() => forgotPassword.mutate(getValues("email"))}
            disabled={forgotPassword.isPending}
            style={{
              width: "100%",
              padding: "11px",
              borderRadius: "8px",
              border: "1px solid #D6D0C4",
              background: "white",
              fontSize: "13px",
              fontWeight: 600,
              color: "#5B6661",
              cursor: "pointer",
            }}
          >
            {forgotPassword.isPending ? "Sending…" : "Resend reset email"}
          </button>

          <Link
            href="/login"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              fontSize: "13px",
              fontWeight: 600,
              color: "#C0392B",
              textDecoration: "none",
            }}
          >
            <ArrowLeft size={14} /> Back to sign in
          </Link>
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      eyebrow="Password recovery"
      title={
        <>
          Forgot your<br />
          <span style={{ color: "#C0392B" }}>password?</span>
        </>
      }
      subtitle="No problem. Enter the email on your AutoBull account and we'll send you a reset link."
    >
      <div className="mb-8 space-y-1.5">
        <h2
          style={{
            fontFamily: "var(--font-display, sans-serif)",
            fontSize: "26px",
            fontWeight: 700,
            color: "#0D0D0D",
            letterSpacing: "-0.01em",
          }}
        >
          Reset your password
        </h2>
        <p style={{ fontSize: "14px", color: "#5B6661" }}>
          Remember it?{" "}
          <Link href="/login" style={{ color: "#C0392B", fontWeight: 600, textDecoration: "none" }}>
            Sign in instead
          </Link>
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="space-y-1.5">
          <label style={{ fontSize: "12px", fontWeight: 600, color: "#0D0D0D", textTransform: "uppercase", letterSpacing: "0.06em" }}>
            Email address
          </label>
          <input
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            className={inputClass}
            {...register("email")}
          />
          {errors.email && (
            <p style={{ fontSize: "12px", color: "#C0392B" }}>{errors.email.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={forgotPassword.isPending}
          style={{
            marginTop: "8px",
            width: "100%",
            height: "46px",
            borderRadius: "8px",
            background: "#C0392B",
            color: "#fff",
            fontSize: "13px",
            fontWeight: 700,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            border: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            boxShadow: "0 0 20px rgba(192,57,43,0.35)",
            opacity: forgotPassword.isPending ? 0.6 : 1,
          }}
        >
          {forgotPassword.isPending ? (
            <><Loader2 size={16} className="animate-spin" /> Sending…</>
          ) : (
            <><ArrowUpRight size={16} /> Send reset link</>
          )}
        </button>
      </form>
    </AuthShell>
  );
}