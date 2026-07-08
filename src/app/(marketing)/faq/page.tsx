"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, ArrowRight, HelpCircle } from "lucide-react";

type FaqItem = { q: string; a: string };
type FaqGroup = { category: string; items: FaqItem[] };

const FAQS: FaqGroup[] = [
  {
    category: "Account",
    items: [
      {
        q: "How do I create an account?",
        a: "Click \"Start Investing\" or \"Create an account\", enter your name, email, and password, then verify your email using the link we send you. That's the whole process — no paperwork or manual approval needed to sign up.",
      },
      {
        q: "I didn't get my verification email — what now?",
        a: "Check your spam folder first. If it's not there, go to the login page and use the \"Resend verification email\" option that appears after a failed login attempt on an unverified account.",
      },
      {
        q: "Can I change the email address on my account?",
        a: "Reach out via the Contact page with your current registered email and the new one you'd like to use, and our team will assist with the change after verifying your identity.",
      },
    ],
  },
  {
    category: "Deposits",
    items: [
      {
        q: "Which coins can I deposit?",
        a: "We support BTC, ETH, USDT, and BNB, among others. The exact list of supported coins and networks is shown when you start a deposit from your dashboard.",
      },
      {
        q: "How long does a deposit take to show up?",
        a: "Deposits are reviewed by a member of our team rather than credited automatically. Most are approved within 24 hours of the blockchain confirming your transaction.",
      },
      {
        q: "What if I sent the wrong amount or used the wrong network?",
        a: "Contact us immediately with your transaction hash. We can often still process the deposit manually, but mismatched networks can result in lost funds depending on the coin — always double-check the network before sending.",
      },
    ],
  },
  {
    category: "Investment plans",
    items: [
      {
        q: "How is the ROI determined?",
        a: "Each plan has a fixed ROI percentage and duration set by our team, shown on the plan's page before you invest. Plans are platform-determined and not brokered against real trading positions, so your return doesn't change based on market movement.",
      },
      {
        q: "Can I invest in more than one plan at a time?",
        a: "Yes — there's no limit on how many active plans you can hold simultaneously. Each one matures independently on its own schedule.",
      },
      {
        q: "What happens when a plan matures?",
        a: "Your principal plus the fixed profit is credited to your account balance automatically on the maturity date. From there, the funds are yours to withdraw or reinvest.",
      },
      {
        q: "Can I cancel a plan early?",
        a: "Active plans run for their full duration. If your circumstances change, contact our support team to discuss your options for a specific plan.",
      },
    ],
  },
  {
    category: "Withdrawals",
    items: [
      {
        q: "How long do withdrawals take?",
        a: "Withdrawal requests are reviewed by our team before funds are sent, typically within 24 hours. Once approved, the on-chain transfer time depends on the coin and network you've chosen.",
      },
      {
        q: "Why was my balance reduced before my withdrawal was approved?",
        a: "Requested withdrawal amounts are deducted from your available balance the moment you submit the request. This prevents the same funds from being requested twice while a withdrawal is pending review. If a withdrawal is rejected, the amount is refunded to your balance automatically.",
      },
      {
        q: "Is there a minimum withdrawal amount?",
        a: "Minimums vary by coin and network to keep transaction fees reasonable relative to the amount sent. The current minimum is shown on the withdrawal form in your dashboard.",
      },
    ],
  },
  {
    category: "Security",
    items: [
      {
        q: "Is my balance safe?",
        a: "We use industry-standard security practices, including encrypted password storage and manual human review of every deposit and withdrawal — nothing moves automatically without a person checking it first.",
      },
      {
        q: "What should I do if I suspect unauthorized access to my account?",
        a: "Change your password immediately and contact our support team right away so we can review recent activity on your account and help secure it.",
      },
    ],
  },
];

function AccordionItem({ item, isOpen, onToggle }: { item: FaqItem; isOpen: boolean; onToggle: () => void }) {
  return (
    <div className="border-b border-border last:border-0">
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-4 py-4 text-left"
        aria-expanded={isOpen}
      >
        <span className="text-sm font-semibold text-foreground sm:text-base">{item.q}</span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>
      {isOpen && (
        <p className="pb-4 pr-8 text-sm leading-relaxed text-muted-foreground">{item.a}</p>
      )}
    </div>
  );
}

export default function FaqPage() {
  const [openKey, setOpenKey] = useState<string | null>(`${FAQS[0].category}-0`);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* ── Header band ── */}
      <section className="border-b border-border px-4 pb-10 pt-14 sm:px-6 sm:pt-20 lg:pt-24">
        <div className="mx-auto max-w-3xl text-center">
          <span className="text-[11px] font-bold uppercase tracking-wider text-primary">FAQ</span>
          <h1 className="font-display mt-3 text-3xl font-bold leading-tight tracking-tight sm:text-5xl">
            Frequently asked questions
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-muted-foreground">
            Everything you need to know about accounts, deposits, plans, and withdrawals.
          </p>
        </div>
      </section>

      {/* ── FAQ groups ── */}
      <section className="px-4 py-12 sm:px-6 sm:py-16">
        <div className="mx-auto max-w-3xl space-y-10">
          {FAQS.map((group) => (
            <div key={group.category}>
              <h2 className="font-display mb-2 text-xs font-bold uppercase tracking-wider text-primary">
                {group.category}
              </h2>
              <div className="rounded-xl border border-border bg-card px-5">
                {group.items.map((item, i) => {
                  const key = `${group.category}-${i}`;
                  return (
                    <AccordionItem
                      key={key}
                      item={item}
                      isOpen={openKey === key}
                      onToggle={() => setOpenKey(openKey === key ? null : key)}
                    />
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Still stuck CTA ── */}
      <section className="border-t border-border px-4 py-14 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-3xl rounded-2xl border border-border bg-card p-8 text-center sm:p-12">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <HelpCircle className="h-6 w-6 text-primary" />
          </div>
          <h2 className="font-display text-xl font-bold sm:text-2xl">Didn't find your answer?</h2>
          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
            Our team reads every message and typically replies within 24 hours.
          </p>
          <Link
            href="/contact"
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-primary px-7 py-3 text-sm font-bold uppercase tracking-wide text-primary-foreground transition-opacity hover:opacity-90"
          >
            Contact support <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}