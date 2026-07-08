import Link from "next/link";
import type { ReactNode } from "react";

const LAST_UPDATED = "July 8, 2026";

function Section({ n, title, children }: { n: number; title: string; children: ReactNode }) {
  return (
    <section id={`section-${n}`} className="scroll-mt-24 border-b border-border py-8 first:pt-0 last:border-0">
      <h2 className="font-display mb-3 text-lg font-bold text-foreground sm:text-xl">
        <span className="mr-2 text-muted-foreground">{n}.</span>
        {title}
      </h2>
      <div className="space-y-3 text-sm leading-relaxed text-muted-foreground">{children}</div>
    </section>
  );
}

const SECTIONS = [
  "Acceptance of Terms",
  "Eligibility",
  "Account Registration & Security",
  "Investment Plans & Risk Disclosure",
  "Deposits & Withdrawals",
  "Fees",
  "Prohibited Conduct",
  "Termination & Suspension",
  "Limitation of Liability",
  "Governing Law",
  "Changes to These Terms",
  "Contact",
];

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* ── Header band ── */}
      <section className="border-b border-border px-4 pb-10 pt-14 sm:px-6 sm:pt-20 lg:pt-24">
        <div className="mx-auto max-w-3xl">
          <span className="text-[11px] font-bold uppercase tracking-wider text-primary">Legal</span>
          <h1 className="font-display mt-3 text-3xl font-bold leading-tight tracking-tight sm:text-5xl">
            Terms of Service
          </h1>
          <p className="mt-4 text-sm text-muted-foreground">Last updated {LAST_UPDATED}</p>
        </div>
      </section>

      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
        {/* ── Table of contents ── */}
        <nav className="mb-10 rounded-xl border border-border bg-card p-5">
          <p className="mb-3 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">On this page</p>
          <ol className="grid grid-cols-1 gap-x-6 gap-y-2 text-sm sm:grid-cols-2">
            {SECTIONS.map((title, i) => (
              <li key={title}>
                <a href={`#section-${i + 1}`} className="text-foreground/80 hover:text-primary hover:underline">
                  {i + 1}. {title}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <p className="mb-8 text-sm leading-relaxed text-muted-foreground">
          These Terms of Service ("Terms") govern your access to and use of TorqBridge's website, dashboard, and
          related services (the "Platform"). By creating an account or using the Platform, you agree to be bound
          by these Terms. If you do not agree, do not use the Platform.
        </p>

        <Section n={1} title="Acceptance of Terms">
          <p>
            By registering for an account, you confirm that you have read, understood, and agree to these Terms,
            along with our{" "}
            <Link href="/privacy" className="text-primary hover:underline">
              Privacy Policy
            </Link>
            . We may update these Terms from time to time; continued use of the Platform after changes take
            effect constitutes acceptance of the revised Terms.
          </p>
        </Section>

        <Section n={2} title="Eligibility">
          <p>
            You must be at least 18 years old and legally capable of entering into binding contracts in your
            jurisdiction to use the Platform. By registering, you represent that you meet these requirements and
            that your use of the Platform does not violate any law or regulation applicable to you.
          </p>
          <p>
            The Platform is not available to residents of jurisdictions where participation in crypto-funded
            investment platforms is restricted or prohibited. You are responsible for determining whether your
            use of the Platform is lawful in your jurisdiction.
          </p>
        </Section>

        <Section n={3} title="Account Registration & Security">
          <p>
            You agree to provide accurate, current, and complete information during registration and to keep
            that information up to date. You are responsible for maintaining the confidentiality of your login
            credentials and for all activity that occurs under your account.
          </p>
          <p>
            Notify us immediately if you suspect unauthorized access to your account. We are not liable for any
            loss arising from your failure to safeguard your credentials.
          </p>
        </Section>

        <Section n={4} title="Investment Plans & Risk Disclosure">
          <p>
            Investment plans offered on the Platform carry a fixed, platform-determined return of investment
            (ROI) and maturity period, as described on each plan's page at the time of investment. Plans are{" "}
            <strong className="text-foreground">not brokered against real market positions</strong> — returns are
            set by TorqBridge and are not derived from trading the underlying referenced stock or asset.
          </p>
          <p>
            All investments carry risk, including the risk of loss of principal. Past performance of any plan is
            not indicative of future results. You should only invest funds you can afford to lose, and you are
            solely responsible for evaluating whether a given plan is suitable for your financial circumstances.
          </p>
        </Section>

        <Section n={5} title="Deposits & Withdrawals">
          <p>
            Deposits are made via supported cryptocurrencies and are credited to your account balance following
            manual review and approval by our team. Withdrawal requests are similarly reviewed before funds are
            released; approved withdrawal amounts are deducted from your balance at the time of request to
            prevent double-committal of funds.
          </p>
          <p>
            We reserve the right to request additional verification for deposits or withdrawals above certain
            thresholds, or where we reasonably suspect fraud, error, or a violation of these Terms.
          </p>
        </Section>

        <Section n={6} title="Fees">
          <p>
            Any fees applicable to deposits, withdrawals, or specific investment plans will be disclosed on the
            relevant page prior to your confirming the transaction. We do not charge hidden fees beyond what is
            disclosed at the time of the transaction.
          </p>
        </Section>

        <Section n={7} title="Prohibited Conduct">
          <p>You agree not to:</p>
          <ul className="list-disc space-y-1.5 pl-5">
            <li>Use the Platform for money laundering, terrorist financing, or any other unlawful purpose</li>
            <li>Provide false or misleading information during registration or verification</li>
            <li>Attempt to gain unauthorized access to other accounts or Platform systems</li>
            <li>Interfere with or disrupt the integrity or performance of the Platform</li>
            <li>Use automated means (bots, scrapers) to access the Platform without our written consent</li>
          </ul>
        </Section>

        <Section n={8} title="Termination & Suspension">
          <p>
            We may suspend or terminate your account, and restrict or block withdrawals, if we reasonably believe
            you have violated these Terms, engaged in fraudulent activity, or where required by law. Where
            practicable, we will notify you of the reason for such action.
          </p>
        </Section>

        <Section n={9} title="Limitation of Liability">
          <p>
            To the maximum extent permitted by law, TorqBridge and its affiliates shall not be liable for any
            indirect, incidental, special, or consequential damages arising from your use of the Platform,
            including but not limited to loss of funds due to market volatility, third-party wallet or exchange
            failures, or events outside our reasonable control.
          </p>
        </Section>

        <Section n={10} title="Governing Law">
          <p>
            These Terms are governed by the laws of the jurisdiction in which TorqBridge is incorporated, without
            regard to conflict-of-law principles. Any disputes arising from these Terms shall be resolved in the
            courts of that jurisdiction, unless otherwise required by applicable law.
          </p>
        </Section>

        <Section n={11} title="Changes to These Terms">
          <p>
            We may revise these Terms from time to time. Material changes will be communicated via email or an
            in-app notice prior to taking effect. Your continued use of the Platform after the effective date of
            any changes constitutes acceptance of the revised Terms.
          </p>
        </Section>

        <Section n={12} title="Contact">
          <p>
            Questions about these Terms can be directed to our team via the{" "}
            <Link href="/contact" className="text-primary hover:underline">
              Contact page
            </Link>
            .
          </p>
        </Section>
      </div>
    </div>
  );
}