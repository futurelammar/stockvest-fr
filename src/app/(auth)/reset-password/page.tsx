"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Eye, EyeOff, Loader2, ArrowUpRight, CheckCircle2, XCircle, ArrowLeft } from "lucide-react";
import { AuthShell } from "@/components/auth/auth-shell";
import { useResetPassword } from "@/hooks/use-auth";
import { resetPasswordSchema, type ResetPasswordFormValues } from "@/lib/validators/auth.schema";

const inputClass =
  "w-full rounded-lg border border-[#D6D0C4] bg-white px-3 py-2.5 text-sm text-[#0E1A17] outline-none focus:border-[#C0392B] placeholder:text-[#B0AAA0]";

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={null}>
      <ResetPasswordContent />
    </Suspense>
  );
}

function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const resetPassword = useResetPassword();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = (values: ResetPasswordFormValues) => {
    if (!token) return;
    resetPassword.mutate({ token, newPassword: values.newPassword });
  };

  /* ── No token in URL ── */
  if (!token) {
    return (
      <AuthShell
        eyebrow="Password recovery"
        title={<>Invalid<br /><span style={{ color: "#C0392B" }}>reset link.</span></>}
        subtitle="This reset link is missing its token. Please use the link from your email exactly as sent."
      >
        <div className="space-y-5">
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
            <XCircle size={24} color="#C0392B" />
          </div>
          <div className="space-y-2">
            <h2
              style={{
                fontFamily: "var(--font-display, sans-serif)",
                fontSize: "26px",
                fontWeight: 700,
                color: "#0D0D0D",
              }}
            >
              Missing token
            </h2>
            <p style={{ fontSize: "14px", color: "#5B6661", lineHeight: 1.6 }}>
              The link you followed is incomplete. Use the full link from your email, or request a new one below.
            </p>
          </div>
          <Link
            href="/forgot-password"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              padding: "12px",
              borderRadius: "8px",
              background: "#C0392B",
              color: "#fff",
              fontSize: "13px",
              fontWeight: 700,
              textDecoration: "none",
              textTransform: "uppercase",
              letterSpacing: "0.06em",
            }}
          >
            Request a new link
          </Link>
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

  /* ── Success state ── */
  if (resetPassword.isSuccess) {
    return (
      <AuthShell
        eyebrow="Password recovery"
        title={<>Password<br /><span style={{ color: "#27AE60" }}>reset.</span></>}
        subtitle="Your new password is live. You can sign in with it immediately."
      >
        <div className="space-y-6">
          <div
            style={{
              width: "52px",
              height: "52px",
              borderRadius: "12px",
              background: "rgba(39,174,96,0.12)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <CheckCircle2 size={24} color="#27AE60" />
          </div>
          <div className="space-y-2">
            <h2
              style={{
                fontFamily: "var(--font-display, sans-serif)",
                fontSize: "26px",
                fontWeight: 700,
                color: "#0D0D0D",
              }}
            >
              You're all set
            </h2>
            <p style={{ fontSize: "14px", color: "#5B6661", lineHeight: 1.6 }}>
              Your password has been updated. Sign in with your new password to access your Pitlane Markets dashboard.
            </p>
          </div>
          <Link
            href="/login"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              padding: "13px",
              borderRadius: "8px",
              background: "#C0392B",
              color: "#fff",
              fontSize: "13px",
              fontWeight: 700,
              textDecoration: "none",
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              boxShadow: "0 0 20px rgba(192,57,43,0.35)",
            }}
          >
            <ArrowUpRight size={16} /> Continue to sign in
          </Link>
        </div>
      </AuthShell>
    );
  }

  /* ── Error — expired / invalid token ── */
  if (resetPassword.isError) {
    return (
      <AuthShell
        eyebrow="Password recovery"
        title={<>Link<br /><span style={{ color: "#C0392B" }}>expired.</span></>}
        subtitle="Reset links are only valid for 1 hour. Request a new one below."
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
            <XCircle size={24} color="#C0392B" />
          </div>
          <div className="space-y-2">
            <h2
              style={{
                fontFamily: "var(--font-display, sans-serif)",
                fontSize: "26px",
                fontWeight: 700,
                color: "#0D0D0D",
              }}
            >
              Link expired or invalid
            </h2>
            <p style={{ fontSize: "14px", color: "#5B6661", lineHeight: 1.6 }}>
              This reset link has expired or has already been used. Password reset links are single-use and valid for 1 hour only.
            </p>
          </div>
          <Link
            href="/forgot-password"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              padding: "13px",
              borderRadius: "8px",
              background: "#C0392B",
              color: "#fff",
              fontSize: "13px",
              fontWeight: 700,
              textDecoration: "none",
              textTransform: "uppercase",
              letterSpacing: "0.06em",
            }}
          >
            <ArrowUpRight size={16} /> Request a new link
          </Link>
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

  /* ── Main form ── */
  return (
    <AuthShell
      eyebrow="Password recovery"
      title={
        <>
          Set a new<br />
          <span style={{ color: "#C0392B" }}>password.</span>
        </>
      }
      subtitle="Choose something strong. At least 8 characters, with an uppercase letter and a number."
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
          Create new password
        </h2>
        <p style={{ fontSize: "14px", color: "#5B6661" }}>
          This will replace your current Pitlane Markets password immediately.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="space-y-1.5">
          <label
            style={{
              fontSize: "12px",
              fontWeight: 600,
              color: "#0D0D0D",
              textTransform: "uppercase",
              letterSpacing: "0.06em",
            }}
          >
            New password
          </label>
          <div style={{ position: "relative" }}>
            <input
              type={showNew ? "text" : "password"}
              placeholder="Min 8 characters"
              autoComplete="new-password"
              className={inputClass}
              style={{ paddingRight: "42px" }}
              {...register("newPassword")}
            />
            <button
              type="button"
              onClick={() => setShowNew((v) => !v)}
              style={{
                position: "absolute",
                right: "12px",
                top: "50%",
                transform: "translateY(-50%)",
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "#B0AAA0",
                display: "flex",
              }}
              aria-label={showNew ? "Hide password" : "Show password"}
            >
              {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {errors.newPassword ? (
            <p style={{ fontSize: "12px", color: "#C0392B" }}>{errors.newPassword.message}</p>
          ) : (
            <p style={{ fontSize: "12px", color: "#5B6661" }}>
              At least 8 characters, one uppercase letter, one number.
            </p>
          )}
        </div>

        <div className="space-y-1.5">
          <label
            style={{
              fontSize: "12px",
              fontWeight: 600,
              color: "#0D0D0D",
              textTransform: "uppercase",
              letterSpacing: "0.06em",
            }}
          >
            Confirm password
          </label>
          <div style={{ position: "relative" }}>
            <input
              type={showConfirm ? "text" : "password"}
              placeholder="Re-enter your new password"
              autoComplete="new-password"
              className={inputClass}
              style={{ paddingRight: "42px" }}
              {...register("confirmPassword")}
            />
            <button
              type="button"
              onClick={() => setShowConfirm((v) => !v)}
              style={{
                position: "absolute",
                right: "12px",
                top: "50%",
                transform: "translateY(-50%)",
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "#B0AAA0",
                display: "flex",
              }}
              aria-label={showConfirm ? "Hide password" : "Show password"}
            >
              {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {errors.confirmPassword && (
            <p style={{ fontSize: "12px", color: "#C0392B" }}>{errors.confirmPassword.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={resetPassword.isPending}
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
            opacity: resetPassword.isPending ? 0.6 : 1,
          }}
        >
          {resetPassword.isPending ? (
            <><Loader2 size={16} className="animate-spin" /> Saving…</>
          ) : (
            <><ArrowUpRight size={16} /> Save new password</>
          )}
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
      </form>
    </AuthShell>
  );
}