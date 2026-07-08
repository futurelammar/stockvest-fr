"use client";

import Link from "next/link";
import { Mail, Clock, ShieldCheck, ArrowRight } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* ── Header band ── */}
      <section className="border-b border-border px-4 pb-10 pt-14 sm:px-6 sm:pt-20 lg:pt-24">
        <div className="mx-auto max-w-5xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            <span className="text-[11px] font-bold uppercase tracking-wider text-primary">
              Support online — reply under 24h
            </span>
          </div>

          <h1 className="font-display max-w-xl text-3xl font-bold leading-tight tracking-tight sm:text-5xl">
            Get in touch
          </h1>
          <p className="mt-4 max-w-md text-base leading-relaxed text-muted-foreground">
            Questions about a deposit, a plan, or your account — a real person on our team reads every message.
          </p>
        </div>
      </section>

      {/* ── Info cards ── */}
      <section className="px-4 py-12 sm:px-6 sm:py-16">
        <div className="mx-auto max-w-5xl">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {[
              {
                icon: Mail,
                title: "Email us directly",
                body: "support@torqbridge.com",
              },
              {
                icon: Clock,
                title: "Response time",
                body: "Under 24 hours, every day — deposits and withdrawals are reviewed by a human, not a bot.",
              },
              {
                icon: ShieldCheck,
                title: "Account & security",
                body: "For anything involving your balance or login, include the email on your account so we can verify you faster.",
              },
            ].map((item) => (
              <div key={item.title} className="rounded-xl border border-border bg-card p-5">
                <div className="mb-3.5 flex h-9 w-9 items-center justify-center rounded-lg bg-muted">
                  <item.icon className="h-4 w-4 text-accent" />
                </div>
                <h3 className="font-display text-sm font-bold text-card-foreground">{item.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{item.body}</p>
              </div>
            ))}
          </div>

          <Link
            href="/faq"
            className="mt-4 flex items-center justify-between rounded-xl border border-primary/25 bg-primary/5 px-5 py-4 no-underline"
          >
            <span className="text-sm font-semibold text-foreground">Check the FAQ first — quick answers</span>
            <ArrowRight className="h-4 w-4 shrink-0 text-primary" />
          </Link>
        </div>
      </section>
    </div>
  );
}