'use client';

import Link from 'next/link';
import {
  ArrowRight, TrendingUp, Shield, Zap, Clock,
  Users, Target, BarChart3, CheckCircle, Award,
  Car, Globe, Lock,
} from 'lucide-react';

// ─── Design tokens ────────────────────────────────────────────────
const INK     = '#0E1A17';
const EMERALD = '#1F6F4F';
const GOLD    = '#C9A24B';
const CREAM   = '#F7F4EE';
const MUTED   = '#A8B5A0';
const SLATE   = '#5B6661';
const CARD_BG = 'rgba(31,111,79,0.05)';
const CARD_BORDER = 'rgba(31,111,79,0.18)';

// ─── Shared section header ─────────────────────────────────────────
function SectionHeader({
  eyebrow, title, subtitle, light = false,
}: {
  eyebrow: string; title: string; subtitle: string; light?: boolean;
}) {
  return (
    <div className="text-center max-w-2xl mx-auto">
      <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: GOLD }}>
        {eyebrow}
      </p>
      <h2
        className="font-display text-3xl sm:text-4xl font-bold mb-4 leading-tight"
        style={{ color: light ? INK : CREAM }}
      >
        {title}
      </h2>
      <p className="leading-relaxed" style={{ color: light ? SLATE : MUTED }}>
        {subtitle}
      </p>
    </div>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────
function Hero() {
  return (
    <section
      className="relative overflow-hidden"
      style={{ background: `linear-gradient(160deg, ${INK} 0%, #071210 100%)` }}
    >
      {/* Glows */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/4 top-1/3 h-[600px] w-[600px] rounded-full blur-3xl"
          style={{ background: 'rgba(31,111,79,0.1)' }} />
        <div className="absolute right-1/4 bottom-0 h-64 w-64 rounded-full blur-3xl"
          style={{ background: 'rgba(201,162,75,0.07)' }} />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <div className="grid gap-16 lg:grid-cols-2 lg:items-center">

          {/* Left */}
          <div>
            <div
              className="mb-6 inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-bold uppercase tracking-widest"
              style={{ borderColor: 'rgba(201,162,75,0.3)', background: 'rgba(201,162,75,0.07)', color: GOLD }}
            >
              <Car className="h-3.5 w-3.5" /> About AutoBull
            </div>
            <h1
              className="font-display text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl mb-6"
              style={{ color: CREAM }}
            >
              Where automotive
              <br />
              <span style={{ color: EMERALD }}>meets</span>{' '}
              <span style={{ color: GOLD }}>investment</span>
            </h1>
            <p className="text-lg leading-relaxed mb-8" style={{ color: MUTED }}>
              AutoBull is the first crypto-funded investment platform built entirely around
              the automotive industry — from blue-chip automakers to EV pioneers, parts
              suppliers, and mobility tech. We turn car market performance into structured,
              fixed-return investment plans for everyday investors.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/register"
                className="flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-bold transition-all"
                style={{ background: EMERALD, color: CREAM }}
                onMouseEnter={e => (e.currentTarget.style.background = '#196040')}
                onMouseLeave={e => (e.currentTarget.style.background = EMERALD)}
              >
                Start investing <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/plans"
                className="flex items-center gap-2 rounded-xl border px-6 py-3 text-sm font-medium transition-all"
                style={{ borderColor: 'rgba(201,162,75,0.3)', color: GOLD }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = GOLD;
                  e.currentTarget.style.background = 'rgba(201,162,75,0.08)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = 'rgba(201,162,75,0.3)';
                  e.currentTarget.style.background = 'transparent';
                }}
              >
                View plans
              </Link>
            </div>
          </div>

          {/* Right — stats */}
          <div className="grid grid-cols-2 gap-4">
            {[
              { value: '$2.4M+',  label: 'Total invested',     icon: TrendingUp },
              { value: '1,200+',  label: 'Active investors',   icon: Users },
              { value: '18%',     label: 'Avg annual ROI',     icon: BarChart3 },
              { value: '24h',     label: 'Deposit review time', icon: Zap },
            ].map(({ value, label, icon: Icon }) => (
              <div
                key={label}
                className="rounded-2xl border p-5"
                style={{ background: CARD_BG, borderColor: CARD_BORDER }}
              >
                <div
                  className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl"
                  style={{ background: 'rgba(31,111,79,0.15)', border: '1px solid rgba(31,111,79,0.25)' }}
                >
                  <Icon className="h-5 w-5" style={{ color: '#34d399' }} />
                </div>
                <p className="font-mono text-2xl font-bold" style={{ color: CREAM }}>{value}</p>
                <p className="mt-1 text-xs" style={{ color: SLATE }}>{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Mission ──────────────────────────────────────────────────────
function Mission() {
  return (
    <section className="py-24" style={{ background: '#F7F4EE' }}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-16 lg:grid-cols-2 lg:items-center">

          {/* Left — quote block */}
          <div>
            <div
              className="rounded-2xl border-l-4 p-8"
              style={{ background: 'rgba(31,111,79,0.05)', borderLeftColor: EMERALD }}
            >
              <p className="font-display text-2xl font-bold leading-snug" style={{ color: INK }}>
                &ldquo;The automotive sector is one of the most stable, most-watched, and most
                misunderstood investment categories in the world. We built AutoBull to make it
                accessible to everyone.&rdquo;
              </p>
              <div className="mt-6 flex items-center gap-3">
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold"
                  style={{ background: EMERALD, color: CREAM }}
                >
                  AB
                </div>
                <div>
                  <p className="text-sm font-semibold" style={{ color: INK }}>AutoBull Team</p>
                  <p className="text-xs" style={{ color: SLATE }}>Founders</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right — mission text */}
          <div>
            <p
              className="mb-4 text-xs font-bold uppercase tracking-widest"
              style={{ color: GOLD }}
            >
              Our mission
            </p>
            <h2 className="font-display text-3xl font-bold mb-6" style={{ color: INK }}>
              Democratising automotive investment
            </h2>
            <div className="space-y-4" style={{ color: SLATE }}>
              <p className="leading-relaxed">
                AutoBull was founded on a simple observation: the automotive industry touches
                every corner of the global economy — manufacturing, energy, technology, supply
                chains — yet most retail investors have no structured way to participate in its
                growth.
              </p>
              <p className="leading-relaxed">
                We curate investment plans themed around real automotive stocks and sector
                movements. Each plan is reviewed by our team, backed by transparent fixed
                returns, and funded entirely through cryptocurrency — so you can start earning
                without a brokerage account or minimum wealth threshold.
              </p>
              <p className="leading-relaxed">
                Our returns are platform-determined, not tied to moment-to-moment price swings.
                You invest a fixed amount, wait for the plan to mature, and receive your
                principal plus a pre-agreed profit. Clear, structured, predictable.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── How we're different ──────────────────────────────────────────
function Difference() {
  const items = [
    {
      icon: Car,
      title: 'Automotive-first',
      desc: 'Every plan is built around automotive and mobility stocks — from legacy OEMs like Ford and Toyota to EV disruptors like Tesla and Rivian. We know this sector deeply.',
    },
    {
      icon: Lock,
      title: 'Fixed, transparent returns',
      desc: 'No guessing. Every plan shows exactly what you earn before you invest. Your ROI is set at the time of investment and guaranteed at maturity.',
    },
    {
      icon: Globe,
      title: 'Crypto-funded globally',
      desc: 'Deposit with BTC, ETH, USDT, BNB, or USDC from anywhere in the world. No bank accounts, no wire transfers, no geographic restrictions.',
    },
    {
      icon: Zap,
      title: 'Same-day activation',
      desc: 'Deposits are reviewed within hours, not days. Once approved, your funds are immediately available to invest in any active plan.',
    },
    {
      icon: Shield,
      title: 'No speculation required',
      desc: "You don't need to predict whether TSLA goes up or RIVN recovers. Our team handles the market analysis — you just pick a plan that fits your timeline.",
    },
    {
      icon: Clock,
      title: 'Short to medium horizons',
      desc: 'Plans range from 3 to 90 days. No locking up your capital for years. When your plan matures, profit is instantly credited to your wallet.',
    },
  ];

  return (
    <section className="py-24" style={{ background: 'rgba(14,26,23,0.97)' }}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="What sets us apart"
          title="Built differently, on purpose"
          subtitle="We made deliberate choices that make AutoBull unlike any other investment platform you've used."
        />
        <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="group rounded-2xl border p-6 transition-all duration-300"
              style={{ background: CARD_BG, borderColor: CARD_BORDER }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(201,162,75,0.3)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = CARD_BORDER; }}
            >
              <div
                className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl border"
                style={{ background: 'rgba(31,111,79,0.12)', borderColor: 'rgba(31,111,79,0.25)' }}
              >
                <Icon className="h-5 w-5" style={{ color: EMERALD }} />
              </div>
              <h3 className="mb-2 font-semibold" style={{ color: CREAM }}>{title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: MUTED }}>{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Sectors we cover ─────────────────────────────────────────────
function Sectors() {
  const sectors = [
    { name: 'Legacy automakers',     desc: 'Ford, GM, Toyota, Volkswagen, BMW — the foundations of global mobility', icon: Car },
    { name: 'Electric vehicles',      desc: 'Tesla, Rivian, Lucid, BYD — the electrification of transportation', icon: Zap },
    { name: 'Auto parts & supply',    desc: 'Bosch, Magna, Aptiv — the backbone of every vehicle built', icon: Target },
    { name: 'Mobility technology',    desc: 'Uber, Waymo, Mobileye — software redefining how we move', icon: Globe },
    { name: 'Financial services',     desc: 'Ford Credit, GM Financial — the capital behind car ownership', icon: BarChart3 },
    { name: 'Platform custom stocks', desc: 'Our team-curated plans not tied to a single public ticker', icon: Award },
  ];

  return (
    <section className="py-24" style={{ background: '#071210' }}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="Sectors we cover"
          title="The full automotive value chain"
          subtitle="Every plan on AutoBull maps to a real corner of the automotive industry — not just carmakers."
        />
        <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sectors.map(({ name, desc, icon: Icon }) => (
            <div
              key={name}
              className="flex gap-4 rounded-2xl border p-5"
              style={{ background: 'rgba(255,255,255,0.02)', borderColor: 'rgba(255,255,255,0.07)' }}
            >
              <div
                className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
                style={{ background: 'rgba(31,111,79,0.12)', border: '1px solid rgba(31,111,79,0.2)' }}
              >
                <Icon className="h-4 w-4" style={{ color: '#34d399' }} />
              </div>
              <div>
                <h3 className="font-semibold text-sm" style={{ color: CREAM }}>{name}</h3>
                <p className="mt-1 text-xs leading-relaxed" style={{ color: MUTED }}>{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Values ───────────────────────────────────────────────────────
function Values() {
  const values = [
    {
      n: '01',
      title: 'Transparency first',
      desc: 'Every fee, every return, every risk — stated clearly before you invest. We never hide the fine print.',
    },
    {
      n: '02',
      title: 'Accessibility',
      desc: 'Minimum investments start at $10. No accredited investor requirements. No minimum wealth threshold. Anyone can participate.',
    },
    {
      n: '03',
      title: 'Speed over bureaucracy',
      desc: 'Deposits reviewed in hours. Withdrawals processed within 24 hours. We built operations around your time, not ours.',
    },
    {
      n: '04',
      title: 'Honest expectations',
      desc: "Our returns are platform-determined — we don't promise the market, we promise our structure. That's a meaningful difference.",
    },
  ];

  return (
    <section className="py-24" style={{ background: '#F7F4EE' }}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="Our values"
          title="What we actually believe"
          subtitle="We wrote these down because we make product decisions against them every week."
          light
        />
        <div className="mt-16 grid gap-6 sm:grid-cols-2">
          {values.map(({ n, title, desc }) => (
            <div
              key={n}
              className="rounded-2xl border p-7"
              style={{ background: 'rgba(31,111,79,0.04)', borderColor: 'rgba(31,111,79,0.15)' }}
            >
              <div className="flex items-start gap-4">
                <span
                  className="font-mono text-3xl font-bold shrink-0"
                  style={{ color: 'rgba(31,111,79,0.25)' }}
                >
                  {n}
                </span>
                <div>
                  <h3 className="font-display text-lg font-bold mb-2" style={{ color: INK }}>{title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: SLATE }}>{desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── How it works (process) ───────────────────────────────────────
function Process() {
  const steps = [
    { n: 1, title: 'Create your account',   desc: 'Sign up with your email. Verify and you\'re in — no KYC required to get started.' },
    { n: 2, title: 'Fund your wallet',       desc: 'Deposit BTC, ETH, USDT, BNB, or USDC. Our team reviews and confirms within hours.' },
    { n: 3, title: 'Choose an auto plan',    desc: 'Browse plans themed on automotive stocks. Pick one that matches your timeline and amount.' },
    { n: 4, title: 'Collect your returns',   desc: 'When the plan matures, your principal plus profit is credited to your wallet automatically.' },
  ];

  return (
    <section className="py-24" style={{ background: 'rgba(14,26,23,0.97)' }}>
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="The process"
          title="Simple from first deposit to first payout"
          subtitle="We removed every unnecessary step between you and your returns."
        />
        <div className="mt-16 space-y-4">
          {steps.map(({ n, title, desc }, i) => (
            <div
              key={n}
              className="flex gap-5 rounded-2xl border p-6"
              style={{ background: CARD_BG, borderColor: CARD_BORDER }}
            >
              <div
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-bold"
                style={{ background: GOLD, color: INK }}
              >
                {n}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold mb-1" style={{ color: CREAM }}>{title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: MUTED }}>{desc}</p>
              </div>
              {i < steps.length - 1 && (
                <div className="hidden self-center sm:block">
                  <ArrowRight className="h-4 w-4" style={{ color: 'rgba(31,111,79,0.3)' }} />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Trust section ────────────────────────────────────────────────
function Trust() {
  const items = [
    { icon: Shield,      text: 'All transactions are logged and traceable' },
    { icon: CheckCircle, text: 'Returns are fixed — no hidden adjustments post-investment' },
    { icon: Lock,        text: 'Withdrawals processed within 24 hours of approval' },
    { icon: Users,       text: 'Withdrawal rejections trigger automatic balance refunds' },
    { icon: Zap,         text: 'Maturity payouts are automated — no manual action needed' },
    { icon: BarChart3,   text: 'Full transaction history available in your dashboard' },
  ];

  return (
    <section className="py-24" style={{ background: '#071210' }}>
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="Why trust AutoBull"
          title="We designed trust into the structure"
          subtitle="Not just a promise — actual product decisions that protect your money."
        />
        <div className="mt-14 grid gap-3 sm:grid-cols-2">
          {items.map(({ icon: Icon, text }) => (
            <div
              key={text}
              className="flex items-center gap-3 rounded-xl border p-4"
              style={{ background: 'rgba(255,255,255,0.02)', borderColor: 'rgba(255,255,255,0.07)' }}
            >
              <div
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
                style={{ background: 'rgba(31,111,79,0.15)', border: '1px solid rgba(31,111,79,0.25)' }}
              >
                <Icon className="h-4 w-4" style={{ color: '#34d399' }} />
              </div>
              <p className="text-sm" style={{ color: MUTED }}>{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── CTA ──────────────────────────────────────────────────────────
function CTA() {
  return (
    <section className="py-24" style={{ background: 'rgba(14,26,23,0.97)' }}>
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
        <div
          className="relative overflow-hidden rounded-3xl border p-12"
          style={{ background: 'rgba(31,111,79,0.07)', borderColor: 'rgba(31,111,79,0.25)' }}
        >
          <div
            className="pointer-events-none absolute inset-0"
            style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(31,111,79,0.18) 0%, transparent 70%)' }}
          />
          <div className="relative">
            <div
              className="mb-5 inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold"
              style={{ borderColor: 'rgba(201,162,75,0.3)', background: 'rgba(201,162,75,0.08)', color: '#6EBA9E' }}
            >
              <Car className="h-3.5 w-3.5" /> Automotive investment, simplified
            </div>
            <h2 className="font-display text-3xl font-bold mb-4 sm:text-4xl" style={{ color: CREAM }}>
              Ready to put your money in the fast lane?
            </h2>
            <p className="mx-auto mb-8 max-w-xl" style={{ color: MUTED }}>
              Join over 1,200 investors already earning fixed returns on automotive
              sector plans. Create your account and make your first investment today.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/register"
                className="flex w-full items-center justify-center gap-2 rounded-xl px-8 py-3.5 text-base font-bold transition-all sm:w-auto"
                style={{ background: EMERALD, color: CREAM }}
                onMouseEnter={e => (e.currentTarget.style.background = '#196040')}
                onMouseLeave={e => (e.currentTarget.style.background = EMERALD)}
              >
                Create free account <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/plans"
                className="flex w-full items-center justify-center gap-2 rounded-xl border px-8 py-3.5 text-base font-medium transition-all sm:w-auto"
                style={{ borderColor: 'rgba(201,162,75,0.3)', color: GOLD }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = GOLD;
                  e.currentTarget.style.background = 'rgba(201,162,75,0.08)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = 'rgba(201,162,75,0.3)';
                  e.currentTarget.style.background = 'transparent';
                }}
              >
                Browse auto plans
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Page ─────────────────────────────────────────────────────────
export default function AboutPage() {
  return (
    <div style={{ background: INK }}>
      <Hero />
      <Mission />
      <Difference />
      <Sectors />
      <Values />
      <Process />
      <Trust />
      <CTA />
    </div>
  );
}