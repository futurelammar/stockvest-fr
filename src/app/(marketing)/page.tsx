'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import {
  ArrowRight, TrendingUp, Shield, Zap, Clock,
  DollarSign, Users, Award, ChevronDown, ChevronUp,
  Star, CheckCircle, Lock, BarChart3, Globe, Cpu,
} from 'lucide-react';
import { api } from "@/lib/api";
import { formatCurrency, cn } from '@/lib/utils';

const fetchPlans        = () => api.get('/investment-plans').then(r => r.data);
const fetchTestimonials = () => api.get('/testimonials').then(r => r.data);
const fetchFaqs         = () => api.get('/faqs').then(r => r.data);

// ─── Design tokens ────────────────────────────────────────────────
const INK     = '#0E1A17';
const EMERALD = '#1F6F4F';
const GOLD    = '#C9A24B';
const CREAM   = '#F7F4EE';
const MUTED   = '#A8B5A0';
const CARD_BG = 'rgba(31, 111, 79, 0.06)';
const CARD_BORDER = 'rgba(31, 111, 79, 0.18)';

// ─── Shared section header ─────────────────────────────────────────
function SectionHeader({ eyebrow, title, subtitle }: { eyebrow: string; title: string; subtitle: string }) {
  return (
    <div className="text-center max-w-2xl mx-auto">
      <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: GOLD }}>
        {eyebrow}
      </p>
      <h2 className="font-display text-3xl sm:text-4xl font-bold mb-4 leading-tight" style={{ color: CREAM }}>
        {title}
      </h2>
      <p className="leading-relaxed" style={{ color: MUTED }}>{subtitle}</p>
    </div>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────
function Hero() {
  return (
    <section
      className="relative flex min-h-[calc(100vh-4rem)] items-center justify-center overflow-hidden"
      style={{ background: `linear-gradient(160deg, ${INK} 0%, #0a1610 60%, #071210 100%)` }}
    >
      {/* Radial glows */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/3 top-1/4 h-[500px] w-[500px] rounded-full blur-3xl"
          style={{ background: 'rgba(31, 111, 79, 0.12)' }} />
        <div className="absolute right-1/4 bottom-1/3 h-80 w-80 rounded-full blur-3xl"
          style={{ background: 'rgba(201, 162, 75, 0.07)' }} />
        {/* Subtle dot grid */}
        <div className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: `radial-gradient(${EMERALD} 1px, transparent 1px)`, backgroundSize: '32px 32px' }} />
      </div>

      <div className="relative mx-auto max-w-5xl px-4 py-24 text-center sm:px-6 lg:px-8">
        {/* Badge */}
        <div className="mb-8 inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-semibold uppercase tracking-widest"
          style={{ borderColor: 'rgba(31,111,79,0.35)', background: 'rgba(31,111,79,0.1)', color: GOLD }}>
          <span className="h-1.5 w-1.5 animate-pulse rounded-full" style={{ background: GOLD }} />
          Premium Stock Investment Platform
        </div>

        {/* Headline */}
        <h1 className="font-display mb-6 text-4xl font-bold leading-[1.1] tracking-tight sm:text-6xl lg:text-7xl" style={{ color: CREAM }}>
          Grow Your Wealth{' '}
          <span style={{ color: EMERALD }}>Smarter</span>{' '}
          &amp;{' '}
          <span style={{ color: GOLD }}>Faster</span>
        </h1>

        <p className="mx-auto mb-10 max-w-xl text-lg leading-relaxed sm:text-xl" style={{ color: MUTED }}>
          Invest in curated stock-themed plans with fixed, transparent returns.
          Fund with crypto. Track everything in real time.
        </p>

        {/* CTAs */}
        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="/register"
            className="flex w-full items-center justify-center gap-2 rounded-xl px-8 py-3.5 text-base font-bold transition-all duration-200 sm:w-auto"
            style={{ background: EMERALD, color: CREAM }}
            onMouseEnter={e => (e.currentTarget.style.background = '#196040')}
            onMouseLeave={e => (e.currentTarget.style.background = EMERALD)}
          >
            Start Investing <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/plans"
            className="flex w-full items-center justify-center gap-2 rounded-xl border px-8 py-3.5 text-base font-medium transition-all duration-200 sm:w-auto"
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
            Browse Plans
          </Link>
        </div>

        {/* Stats strip */}
        <div className="mt-16 inline-flex flex-wrap items-center justify-center gap-8 rounded-2xl border px-8 py-5 sm:gap-12"
          style={{ background: 'rgba(31,111,79,0.08)', borderColor: 'rgba(31,111,79,0.25)' }}>
          {[
            { label: 'Total Invested',   value: '$2.4M+' },
            { label: 'Active Investors', value: '1,200+' },
            { label: 'Plans Available',  value: '12+'    },
            { label: 'Avg Annual ROI',   value: '18%'    },
          ].map(({ label, value }) => (
            <div key={label} className="text-center">
              <p className="font-mono text-xl font-bold" style={{ color: GOLD }}>{value}</p>
              <p className="mt-0.5 text-xs" style={{ color: MUTED }}>{label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── How it works ─────────────────────────────────────────────────
function HowItWorks() {
  const steps = [
    { n: 1, icon: Users,      title: 'Create Account', desc: 'Sign up in 2 minutes. Verify your email and you\'re in.' },
    { n: 2, icon: DollarSign, title: 'Deposit Crypto',  desc: 'Fund your wallet with BTC, ETH, USDT or BNB. Minimum $10.' },
    { n: 3, icon: TrendingUp, title: 'Pick a Plan',     desc: 'Choose from curated stock plans with clear ROI terms.' },
    { n: 4, icon: Award,      title: 'Earn Returns',    desc: 'Profit is automatically credited when your plan matures.' },
  ];

  return (
    <section className="py-24" style={{ background: 'rgba(14,26,23,0.97)' }}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="How It Works"
          title="Four steps to growing your wealth"
          subtitle="Simple, transparent, and fast. No hidden fees, no complex processes."
        />
        <div className="mt-16 grid gap-8 md:grid-cols-4">
          {steps.map(({ n, icon: Icon, title, desc }) => (
            <div key={n} className="group flex flex-col items-center text-center">
              <div className="relative mb-5">
                <div
                  className="flex h-20 w-20 items-center justify-center rounded-2xl border transition-all duration-300 group-hover:-translate-y-1"
                  style={{ background: CARD_BG, borderColor: CARD_BORDER }}
                >
                  <Icon className="h-8 w-8" style={{ color: EMERALD }} />
                </div>
                <span
                  className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-lg text-xs font-bold"
                  style={{ background: GOLD, color: INK }}
                >
                  {n}
                </span>
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

// ─── Plans ────────────────────────────────────────────────────────
function PlanCard({ plan }: { plan: any }) {
  const roi    = plan.roiPercentage ?? plan.roiPercent ?? 0;
  const days   = plan.durationInDays ?? plan.durationDays ?? 0;
  const minAmt = plan.minimumInvestment ?? plan.minAmount ?? 0;
  const maxAmt = plan.maximumInvestment ?? plan.maxAmount ?? 0;
  const name   = plan.planName ?? plan.name ?? 'Investment Plan';
  const image  = plan.featuredImage ?? plan.image;

  return (
    <div
      className="group flex flex-col rounded-2xl border overflow-hidden transition-all duration-300 hover:-translate-y-1"
      style={{ background: CARD_BG, borderColor: CARD_BORDER }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(201,162,75,0.35)'; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = CARD_BORDER; }}
    >
      {/* Stock header — always shown since API populates stock */}
      {plan.stock && (
        <div
          className="flex items-center justify-between border-b px-4 py-3"
          style={{ background: 'rgba(14,26,23,0.6)', borderColor: 'rgba(31,111,79,0.15)' }}
        >
          <div className="flex items-center gap-2 min-w-0">
            <div
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[10px] font-bold"
              style={{ background: 'rgba(31,111,79,0.25)', color: '#6EBA9E' }}
            >
              {plan.stock.ticker?.slice(0, 2)}
            </div>
            <div className="min-w-0">
              <p className="font-mono text-[10px] uppercase tracking-widest truncate" style={{ color: MUTED }}>
                {plan.stock.ticker}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className="font-mono text-xs font-semibold" style={{ color: CREAM }}>
              ${plan.stock.currentPrice?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
            <span
              className="rounded-full px-1.5 py-0.5 font-mono text-[10px] font-bold"
              style={{
                background: plan.stock.changePercent >= 0 ? 'rgba(31,111,79,0.2)' : 'rgba(168,57,47,0.2)',
                color: plan.stock.changePercent >= 0 ? '#6EBA9E' : '#E07070',
              }}
            >
              {plan.stock.changePercent >= 0 ? '+' : ''}{plan.stock.changePercent?.toFixed(2)}%
            </span>
          </div>
        </div>
      )}

      {/* Featured image */}
      {image && !plan.stock && (
        <div className="h-36 overflow-hidden">
          <img src={image} alt={name}
            className="h-full w-full object-cover opacity-70 transition-transform duration-500 group-hover:scale-105" />
        </div>
      )}

      <div className="flex flex-1 flex-col p-5">
        {/* Plan name + ROI */}
        <div className="mb-3 flex items-start justify-between gap-2">
          <h3 className="font-display text-base font-bold leading-snug" style={{ color: CREAM }}>
            {name}
          </h3>
          <span
            className="shrink-0 rounded-lg px-2.5 py-0.5 text-sm font-bold"
            style={{ background: 'rgba(31,111,79,0.2)', color: '#6EBA9E' }}
          >
            {roi}%
          </span>
        </div>

        <p className="mb-4 flex-1 text-xs leading-relaxed line-clamp-2" style={{ color: MUTED }}>
          {plan.description}
        </p>

        {/* Stats grid */}
        <div
          className="mb-4 grid grid-cols-2 gap-2 rounded-xl border p-3"
          style={{ background: 'rgba(14,26,23,0.5)', borderColor: 'rgba(31,111,79,0.15)' }}
        >
          {[
            ['Duration',   `${days} days`],
            ['ROI',        `${roi}% fixed`],
            ['Min invest', `$${minAmt.toLocaleString()}`],
            ['Max invest', `$${maxAmt.toLocaleString()}`],
          ].map(([l, v]) => (
            <div key={l}>
              <p className="text-[10px] uppercase tracking-wide" style={{ color: MUTED }}>{l}</p>
              <p className="mt-0.5 text-xs font-semibold" style={{ color: CREAM }}>{v}</p>
            </div>
          ))}
        </div>

        {/* Stock disclaimer */}
        {plan.stock?.ticker && (
          <p className="mb-3 text-[10px] leading-relaxed" style={{ color: 'rgba(168,181,160,0.6)' }}>
            Inspired by {plan.stock.ticker} · returns are platform-determined
          </p>
        )}

        <Link
          href={`/plans/${plan._id}`}
          className="block w-full rounded-xl py-2.5 text-center text-sm font-semibold transition-all duration-200"
          style={{ background: EMERALD, color: CREAM }}
          onMouseEnter={e => (e.currentTarget.style.background = '#196040')}
          onMouseLeave={e => (e.currentTarget.style.background = EMERALD)}
        >
          View Plan
        </Link>
      </div>
    </div>
  );
}

function PlansPreview() {
  const { data, isLoading } = useQuery({ queryKey: ['public-plans'], queryFn: fetchPlans });
  const plans: any[] = (data?.data ?? data ?? []).slice(0, 3);

  const defaults = [
    { _id: '1', name: 'Blue Chip Stocks', roiPercent: 12, durationDays: 30, minAmount: 50,  maxAmount: 5000,  description: 'Stable returns from the most established publicly traded companies.' },
    { _id: '2', name: 'Tech Growth',      roiPercent: 18, durationDays: 60, minAmount: 100, maxAmount: 10000, description: 'High-growth technology sector stocks with aggressive ROI targets.' },
    { _id: '3', name: 'Dividend Yield',   roiPercent: 22, durationDays: 90, minAmount: 200, maxAmount: 20000, description: 'Income-focused strategy targeting consistent dividend-paying stocks.' },
  ];

  return (
    <section className="py-24" style={{ background: '#071210' }}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="Investment Plans"
          title="Choose your growth strategy"
          subtitle="All plans have fixed, transparent ROI. No surprises, no hidden terms."
        />
        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {isLoading
            ? Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="animate-pulse rounded-2xl border p-6 space-y-4"
                  style={{ background: CARD_BG, borderColor: CARD_BORDER }}>
                  <div className="h-40 rounded-xl" style={{ background: 'rgba(31,111,79,0.1)' }} />
                  <div className="h-5 w-2/3 rounded" style={{ background: 'rgba(31,111,79,0.1)' }} />
                  <div className="h-3 w-full rounded" style={{ background: 'rgba(31,111,79,0.08)' }} />
                  <div className="h-10 rounded-xl" style={{ background: 'rgba(31,111,79,0.1)' }} />
                </div>
              ))
            : (plans.length > 0 ? plans : defaults).map(p => <PlanCard key={p._id} plan={p} />)
          }
        </div>
        <div className="mt-10 text-center">
          <Link
            href="/plans"
            className="inline-flex items-center gap-2 rounded-xl border px-6 py-3 text-sm font-medium transition-all duration-200"
            style={{ borderColor: 'rgba(31,111,79,0.35)', color: '#6EBA9E' }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = EMERALD;
              e.currentTarget.style.color = GOLD;
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = 'rgba(31,111,79,0.35)';
              e.currentTarget.style.color = '#6EBA9E';
            }}
          >
            View all plans <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

// ─── Features ─────────────────────────────────────────────────────
function Features() {
  const features = [
    { icon: Shield,    title: 'Secure and transparent',  desc: 'All transactions are recorded. Funds secured with multi-layer protection. No surprises.' },
    { icon: Zap,       title: 'Fast deposit review',     desc: 'Crypto deposits reviewed within hours. Funds ready to invest the same day.' },
    { icon: BarChart3, title: 'Fixed ROI plans',         desc: 'Clear, pre-agreed returns. Know exactly what you earn before you invest.' },
    { icon: Clock,     title: 'Automated payouts',       desc: 'Returns are automatically credited to your wallet on the maturity date.' },
    { icon: Globe,     title: 'Crypto funded',           desc: 'Deposit with BTC, ETH, USDT, BNB and more. Withdraw the same way.' },
    { icon: Cpu,       title: 'Real-time tracking',      desc: 'Monitor every investment, deposit, and withdrawal from your dashboard.' },
  ];

  return (
    <section className="py-24" style={{ background: 'rgba(14,26,23,0.97)' }}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="Why TorqBridge"
          title="Built for serious investors"
          subtitle="Everything you need to invest with confidence, nothing you don't."
        />
        <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="group rounded-2xl border p-6 transition-all duration-300 hover:-translate-y-0.5"
              style={{ background: CARD_BG, borderColor: CARD_BORDER }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(201,162,75,0.25)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = CARD_BORDER; }}
            >
              <div
                className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl border transition-colors duration-300"
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

// ─── Testimonials ─────────────────────────────────────────────────
function Testimonials() {
  const { data } = useQuery({ queryKey: ['public-testimonials'], queryFn: fetchTestimonials });
  const items: any[] = data?.data ?? data ?? [];
  const defaults = [
    { name: 'James O.',  role: 'Retail Investor',    rating: 5, content: 'TorqBridge gave me consistent 18% returns in 60 days. The dashboard is clean and deposits are fast.' },
    { name: 'Aisha M.',  role: 'Day Trader',          rating: 5, content: 'Finally a platform that delivers on its promises. My withdrawal was processed in under 24 hours.' },
    { name: 'Carlos R.', role: 'Long-term Investor',  rating: 5, content: 'The Blue Chip plan has been my go-to for 6 months. Steady, reliable, fully transparent.' },
  ];
  const testimonials = items.length > 0 ? items : defaults;

  return (
    <section className="py-24" style={{ background: '#071210' }}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader eyebrow="Testimonials" title="Trusted by investors worldwide" subtitle="Don't just take our word for it." />
        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {testimonials.slice(0, 3).map((t: any, i: number) => (
            <div key={i} className="rounded-2xl border p-6" style={{ background: CARD_BG, borderColor: CARD_BORDER }}>
              <div className="mb-4 flex gap-0.5">
                {Array.from({ length: t.rating ?? 5 }).map((_, s) => (
                  <Star key={s} className="h-4 w-4" style={{ color: GOLD, fill: GOLD }} />
                ))}
              </div>
              <p className="mb-5 text-sm leading-relaxed" style={{ color: MUTED }}>
                &ldquo;{t.content ?? t.message}&rdquo;
              </p>
              <div className="flex items-center gap-3">
                {t.avatarUrl ? (
                  <img src={t.avatarUrl} alt={t.name} className="h-9 w-9 rounded-full object-cover" />
                ) : (
                  <div
                    className="flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold"
                    style={{ background: 'rgba(31,111,79,0.25)', color: '#6EBA9E' }}
                  >
                    {(t.name ?? 'U')[0]}
                  </div>
                )}
                <div>
                  <p className="text-sm font-semibold" style={{ color: CREAM }}>{t.name}</p>
                  <p className="text-xs" style={{ color: MUTED }}>{t.role ?? t.position}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── FAQ ──────────────────────────────────────────────────────────
function FAQ() {
  const { data } = useQuery({ queryKey: ['public-faqs'], queryFn: fetchFaqs });
  const items: any[] = data?.data ?? data ?? [];
  const defaults = [
    { question: 'How do I deposit funds?',              answer: 'Go to Dashboard → Deposit, select your crypto, send to the displayed address, upload your proof of payment and we\'ll confirm within hours.' },
    { question: 'When do I receive my ROI?',            answer: 'Returns are automatically credited to your wallet on the plan\'s maturity date. No action required.' },
    { question: 'Are there withdrawal fees?',           answer: 'A small processing fee applies depending on the crypto and network. Fees are always shown before you confirm.' },
    { question: 'Can I invest in multiple plans?',      answer: 'Yes. You can hold as many active investments as your balance allows.' },
    { question: 'What cryptocurrencies do you accept?', answer: 'We accept BTC, ETH, USDT (TRC20 & ERC20), BNB, and USDC.' },
    { question: 'How long does withdrawal take?',       answer: 'Reviewed within 24 hours. Crypto sent within 1–4 hours after approval.' },
  ];
  const faqs = items.length > 0 ? items : defaults;
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="py-24" style={{ background: 'rgba(14,26,23,0.97)' }}>
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <SectionHeader eyebrow="FAQ" title="Common questions answered" subtitle="Everything you need to know before you invest." />
        <div className="mt-14 space-y-2">
          {faqs.slice(0, 8).map((faq: any, i: number) => (
            <div key={i} className="overflow-hidden rounded-xl border" style={{ background: CARD_BG, borderColor: CARD_BORDER }}>
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="flex w-full items-center justify-between px-5 py-4 text-left"
              >
                <span className="text-sm font-medium" style={{ color: open === i ? GOLD : CREAM }}>
                  {faq.question}
                </span>
                {open === i
                  ? <ChevronUp className="h-4 w-4 shrink-0 ml-3" style={{ color: GOLD }} />
                  : <ChevronDown className="h-4 w-4 shrink-0 ml-3" style={{ color: MUTED }} />
                }
              </button>
              {open === i && (
                <div className="border-t px-5 pb-4" style={{ borderColor: 'rgba(31,111,79,0.15)' }}>
                  <p className="pt-3 text-sm leading-relaxed" style={{ color: MUTED }}>
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── CTA banner ───────────────────────────────────────────────────
function CTABanner() {
  return (
    <section className="py-24" style={{ background: '#071210' }}>
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div
          className="relative overflow-hidden rounded-3xl border p-12 text-center"
          style={{ background: 'rgba(31,111,79,0.08)', borderColor: 'rgba(31,111,79,0.3)' }}
        >
          <div className="pointer-events-none absolute inset-0"
            style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(31,111,79,0.15) 0%, transparent 70%)' }} />
          <div className="relative">
            <div
              className="mb-6 inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold"
              style={{ borderColor: 'rgba(31,111,79,0.4)', background: 'rgba(31,111,79,0.12)', color: '#6EBA9E' }}
            >
              <CheckCircle className="h-3.5 w-3.5" />
              No lock-in period on most plans
            </div>
            <h2 className="font-display mb-4 text-3xl font-bold sm:text-4xl" style={{ color: CREAM }}>
              Ready to start earning?
            </h2>
            <p className="mx-auto mb-8 max-w-xl" style={{ color: MUTED }}>
              Join thousands of investors already growing their wealth on TorqBridge
              Create your free account and make your first investment today.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/register"
                className="flex w-full items-center justify-center gap-2 rounded-xl px-8 py-3.5 text-base font-bold transition-all duration-200 sm:w-auto"
                style={{ background: EMERALD, color: CREAM }}
                onMouseEnter={e => (e.currentTarget.style.background = '#196040')}
                onMouseLeave={e => (e.currentTarget.style.background = EMERALD)}
              >
                Create Free Account <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/plans"
                className="flex w-full items-center justify-center gap-2 rounded-xl border px-8 py-3.5 text-base font-medium transition-all duration-200 sm:w-auto"
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
                <Lock className="h-4 w-4" /> View Plans
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Page ─────────────────────────────────────────────────────────
export default function LandingPage() {
  return (
    <>
      <Hero />
      <HowItWorks />
      <PlansPreview />
      <Features />
      <Testimonials />
      <FAQ />
      <CTABanner />
    </>
  );
}