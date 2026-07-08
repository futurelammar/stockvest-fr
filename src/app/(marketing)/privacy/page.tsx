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
  "Information We Collect",
  "How We Use Your Information",
  "Cookies & Similar Technologies",
  "How We Share Information",
  "Data Security",
  "Data Retention",
  "Your Rights & Choices",
  "Children's Privacy",
  "International Data Transfers",
  "Changes to This Policy",
  "Contact",
];

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* ── Header band ── */}
      <section className="border-b border-border px-4 pb-10 pt-14 sm:px-6 sm:pt-20 lg:pt-24">
        <div className="mx-auto max-w-3xl">
          <span className="text-[11px] font-bold uppercase tracking-wider text-primary">Legal</span>
          <h1 className="font-display mt-3 text-3xl font-bold leading-tight tracking-tight sm:text-5xl">
            Privacy Policy
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
          This Privacy Policy explains how TorqBridge ("we", "us") collects, uses, and protects your information
          when you use our website, dashboard, and related services (the "Platform"). By using the Platform, you
          agree to the collection and use of information as described here.
        </p>

        <Section n={1} title="Information We Collect">
          <p>We collect the following categories of information:</p>
          <ul className="list-disc space-y-1.5 pl-5">
            <li>
              <strong className="text-foreground">Account information</strong> — full name, email address, phone
              number (optional), and password (stored as a salted hash, never in plain text)
            </li>
            <li>
              <strong className="text-foreground">Transaction data</strong> — deposit and withdrawal records,
              wallet addresses you provide, investment plan activity, and balance history
            </li>
            <li>
              <strong className="text-foreground">Verification data</strong> — information submitted for
              identity or deposit verification, where applicable
            </li>
            <li>
              <strong className="text-foreground">Usage data</strong> — log data, device/browser information,
              and general interaction data collected automatically when you use the Platform
            </li>
          </ul>
        </Section>

        <Section n={2} title="How We Use Your Information">
          <p>We use the information we collect to:</p>
          <ul className="list-disc space-y-1.5 pl-5">
            <li>Create and maintain your account, and authenticate your login sessions</li>
            <li>Process deposits, withdrawals, and investment plan activity</li>
            <li>Detect, investigate, and prevent fraud, abuse, or violations of our Terms of Service</li>
            <li>Send transactional emails (e.g. verification, deposit/withdrawal status, security alerts)</li>
            <li>Improve and maintain the reliability and security of the Platform</li>
            <li>Comply with applicable legal and regulatory obligations</li>
          </ul>
        </Section>

        <Section n={3} title="Cookies & Similar Technologies">
          <p>
            We use essential cookies to keep you signed in and to maintain the security of your session (for
            example, the cookie that stores your authentication token). We do not use cookies for third-party
            advertising. You can control cookies through your browser settings, though disabling essential
            cookies will prevent you from staying logged in.
          </p>
        </Section>

        <Section n={4} title="How We Share Information">
          <p>We do not sell your personal information. We may share information with:</p>
          <ul className="list-disc space-y-1.5 pl-5">
            <li>Service providers who help us operate the Platform (e.g. hosting, email delivery)</li>
            <li>Regulators or law enforcement, where required by applicable law or legal process</li>
            <li>A successor entity in the event of a merger, acquisition, or sale of assets</li>
          </ul>
        </Section>

        <Section n={5} title="Data Security">
          <p>
            We apply industry-standard safeguards to protect your information, including encrypted password
            storage, HTTPS transport encryption, and restricted internal access to sensitive data. No method of
            transmission or storage is completely secure, and we cannot guarantee absolute security.
          </p>
        </Section>

        <Section n={6} title="Data Retention">
          <p>
            We retain account and transaction data for as long as your account is active, and for a reasonable
            period afterward as required to comply with legal, accounting, or regulatory obligations, resolve
            disputes, and enforce our agreements.
          </p>
        </Section>

        <Section n={7} title="Your Rights & Choices">
          <p>
            Depending on your jurisdiction, you may have the right to access, correct, or request deletion of
            your personal information, or to object to certain processing. To exercise these rights, contact us
            via the{" "}
            <Link href="/contact" className="text-primary hover:underline">
              Contact page
            </Link>
            . Note that we may need to retain certain data to comply with legal or regulatory requirements even
            after an account is closed.
          </p>
        </Section>

        <Section n={8} title="Children's Privacy">
          <p>
            The Platform is not directed at, and is not intended for use by, anyone under the age of 18. We do
            not knowingly collect personal information from minors. If you believe a minor has provided us with
            personal information, please contact us so we can take appropriate action.
          </p>
        </Section>

        <Section n={9} title="International Data Transfers">
          <p>
            Your information may be processed and stored in countries other than your own. Where we transfer
            data internationally, we take steps to ensure it receives an adequate level of protection consistent
            with this Policy and applicable law.
          </p>
        </Section>

        <Section n={10} title="Changes to This Policy">
          <p>
            We may update this Privacy Policy from time to time. Material changes will be communicated via email
            or an in-app notice prior to taking effect. The "Last updated" date at the top of this page reflects
            the most recent revision.
          </p>
        </Section>

        <Section n={11} title="Contact">
          <p>
            Questions about this Privacy Policy, or requests regarding your personal information, can be
            directed to our team via the{" "}
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