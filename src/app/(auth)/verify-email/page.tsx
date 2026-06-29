"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, Loader2, XCircle } from "lucide-react";

import { AuthShell } from "@/components/auth/auth-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useResendVerification, useVerifyEmail } from "@/hooks/use-auth";

const inputClass =
  "h-11 rounded-lg border-[#D6D0C4] bg-white text-brand-ink placeholder:text-[#B0AAA0] focus-visible:ring-brand-emerald";

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={null}>
      <VerifyEmailContent />
    </Suspense>
  );
}

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const verify = useVerifyEmail();
  const resend = useResendVerification();
  const [resendEmail, setResendEmail] = useState("");

  useEffect(() => {
    if (token) verify.mutate(token);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  return (
    <AuthShell
      eyebrow="Account verification"
      title={
        <>
          One confirmation between
          <br />
          you and your <span className="text-emerald-400">first deposit.</span>
        </>
      }
      subtitle="Verification protects every account on the platform from unauthorized deposits and withdrawals."
    >
      {!token && (
        <VerifyState
          tone="error"
          title="Missing verification link"
          description="This page needs a verification token. Use the link from your email, or request a new one below."
        >
          <ResendForm email={resendEmail} setEmail={setResendEmail} onResend={() => resend.mutate(resendEmail)} loading={resend.isPending} />
        </VerifyState>
      )}

      {token && verify.isPending && (
        <VerifyState tone="neutral" title="Verifying your email" description="This only takes a moment." />
      )}

      {token && verify.isSuccess && (
        <VerifyState tone="success" title="Email verified" description="Your account is active. You can sign in now.">
          <Button
            asChild
            className="h-12 w-full rounded-lg bg-brand-emerald text-base font-semibold text-white shadow-md hover:bg-brand-emerald/90"
          >
            <Link href="/login">Continue to sign in</Link>
          </Button>
        </VerifyState>
      )}

      {token && verify.isError && (
        <VerifyState
          tone="error"
          title="That link has expired"
          description="Verification links are valid for 24 hours. Request a new one below."
        >
          <ResendForm email={resendEmail} setEmail={setResendEmail} onResend={() => resend.mutate(resendEmail)} loading={resend.isPending} />
        </VerifyState>
      )}
    </AuthShell>
  );
}

function VerifyState({
  tone,
  title,
  description,
  children,
}: {
  tone: "success" | "error" | "neutral";
  title: string;
  description: string;
  children?: React.ReactNode;
}) {
  const iconWrapClass =
    tone === "success"
      ? "bg-emerald-500/10 text-brand-emerald ring-1 ring-emerald-500/30"
      : tone === "error"
      ? "bg-destructive/10 text-destructive ring-1 ring-destructive/30"
      : "bg-muted text-muted-foreground";

  const Icon = tone === "success" ? CheckCircle2 : tone === "error" ? XCircle : Loader2;

  return (
    <div className="space-y-6">
      <div className={`flex h-14 w-14 items-center justify-center rounded-full ${iconWrapClass}`}>
        <Icon className={`h-7 w-7 ${tone === "neutral" ? "animate-spin" : ""}`} />
      </div>
      <div className="space-y-2">
        <h2 className="font-display text-2xl font-bold tracking-tight text-brand-ink">{title}</h2>
        <p className="text-sm leading-relaxed text-brand-slate">{description}</p>
      </div>
      {children}
    </div>
  );
}

function ResendForm({
  email,
  setEmail,
  onResend,
  loading,
}: {
  email: string;
  setEmail: (v: string) => void;
  onResend: () => void;
  loading: boolean;
}) {
  return (
    <div className="space-y-3">
      <Input type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} />
      <Button
        onClick={onResend}
        disabled={!email || loading}
        className="h-12 w-full rounded-lg bg-brand-emerald text-base font-semibold text-white shadow-md hover:bg-brand-emerald/90"
      >
        {loading ? "Sending…" : "Send new verification link"}
      </Button>
      <Link href="/login" className="block text-center text-sm text-brand-emerald underline-offset-4 hover:underline">
        Back to sign in
      </Link>
    </div>
  );
}