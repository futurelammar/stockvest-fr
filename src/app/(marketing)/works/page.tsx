import Link from "next/link";
import {
  ShieldCheck,
  Wallet,
  TrendingUp,
  Clock,
  ArrowRight,
  CheckCircle2,
  HelpCircle,
} from "lucide-react";

const STEPS = [
  {
    n: "01",
    icon: ShieldCheck,
    title: "Create & verify your account",
    body:
      "Sign up with your name and email in under a minute. Verify your inbox and you're ready to fund your account — no paperwork, no broker, no waiting on approvals to get started.",
  },
  {
    n: "02",
    icon: Wallet,
    title: "Deposit crypto to your balance",
    body:
      "Fund your account balance with BTC, ETH, USDT, or another supported coin. Every deposit is reviewed by a real person on our team — usually within 24 hours — before it's credited.",
  },
  {
    n: "03",
    icon: TrendingUp,
    title: "Choose an investment plan",
    body:
      "Browse plans set by our team, each with a fixed ROI, a set duration, and a minimum/maximum investment amount. Pick the one that fits your goals and confirm your amount.",
  },
  {
    n: "04",
    icon: Clock,
    title: "Collect your return at maturity",
    body:
      "When your plan reaches its maturity date, your principal plus the fixed profit is credited to your balance automatically. From there, withdraw whenever you're ready.",
  },
];

const DETAILS = [
  {
    title: "Returns are fixed, not market-traded",
    body:
      "Plans carry a fixed ROI set upfront — they are not brokered against real trading positions. What you see on a plan page is what you get at maturity, regardless of how the referenced stock or market moves.",
  },
  {
    title: "Every deposit and withdrawal is reviewed by hand",
    body:
      "Nothing moves automatically. A person on our team checks each deposit before it's credited, and each withdrawal before funds are released — no automated approvals, no black boxes.",
  },
  {
    title: "Your balance is protected on withdrawal requests",
    body:
      "When you request a withdrawal, that amount is deducted from your available balance immediately. This prevents you from accidentally double-committing the same funds across multiple requests.",
  },
  {
    title: "You can hold multiple plans at once",
    body:
      "There's no limit to one active plan at a time — invest in as many plans as you'd like, each maturing independently on its own schedule.",
  },
];

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* ── Header band ── */}
      <section className="border-b border-border px-4 pb-10 pt-14 sm:px-6 sm:pt-20 lg:pt-24">
        <div className="mx-auto max-w-3xl text-center">
          <span className="text-[11px] font-bold uppercase tracking-wider text-primary">How it works</span>
          <h1 className="font-display mt-3 text-3xl font-bold leading-tight tracking-tight sm:text-5xl">
            Zero to invested, in four steps
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-muted-foreground">
            No broker, no paperwork, no ambiguity. Here's exactly what happens from the moment you sign up to the
            moment your first plan matures.
          </p>
        </div>
      </section>

      {/* ── Steps timeline ── */}
      <section className="px-4 py-14 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-3xl">
          <ol className="relative">
            {STEPS.map((step, i) => (
              <li key={step.n} className="relative flex gap-5 pb-12 last:pb-0">
                {/* connector line */}
                {i < STEPS.length - 1 && (
                  <span
                    aria-hidden
                    className="absolute left-6 top-14 h-[calc(100%-3rem)] w-px bg-border sm:left-7"
                  />
                )}
                <div className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-primary/30 bg-primary/10 sm:h-14 sm:w-14">
                  <step.icon className="h-5 w-5 text-primary sm:h-6 sm:w-6" />
                </div>
                <div className="pt-1">
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Step {step.n}
                  </p>
                  <h3 className="font-display mt-1 text-lg font-bold text-foreground sm:text-xl">{step.title}</h3>
                  <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">{step.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ── Good-to-know details ── */}
      <section className="border-t border-border px-4 py-14 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-5xl">
          <div className="mb-10 text-center">
            <span className="text-[11px] font-bold uppercase tracking-wider text-primary">Good to know</span>
            <h2 className="font-display mt-3 text-2xl font-bold tracking-tight sm:text-3xl">
              What actually happens behind the scenes
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {DETAILS.map((d) => (
              <div key={d.title} className="rounded-xl border border-border bg-card p-6">
                <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-muted">
                  <CheckCircle2 className="h-4 w-4 text-accent" />
                </div>
                <h3 className="font-display text-base font-bold text-card-foreground">{d.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{d.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Mini FAQ nudge ── */}
      <section className="border-t border-border px-4 py-14 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-3xl rounded-2xl border border-border bg-card p-8 text-center sm:p-12">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <HelpCircle className="h-6 w-6 text-primary" />
          </div>
          <h2 className="font-display text-xl font-bold sm:text-2xl">Still have questions?</h2>
          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
            Check the FAQ for quick answers, or reach out directly — a real person reads every message.
          </p>
          <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/faq"
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-border bg-secondary px-6 py-3 text-sm font-semibold text-secondary-foreground sm:w-auto"
            >
              Browse the FAQ
            </Link>
            <Link
              href="/contact"
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-bold uppercase tracking-wide text-primary-foreground transition-opacity hover:opacity-90 sm:w-auto"
            >
              Contact us <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="border-t border-border px-4 py-14 text-center sm:px-6 sm:py-20">
        <h2 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">Ready to get started?</h2>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
          Create your account in under a minute and browse today's available plans.
        </p>
        <Link
          href="/register"
          className="mt-6 inline-flex items-center gap-2 rounded-lg bg-primary px-8 py-3.5 text-sm font-bold uppercase tracking-wide text-primary-foreground transition-opacity hover:opacity-90"
        >
          Create your account <ArrowRight className="h-4 w-4" />
        </Link>
      </section>
    </div>
  );
}