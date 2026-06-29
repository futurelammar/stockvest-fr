import Link from "next/link";
import { TrendingUp, Mail, Globe, MessageCircle, Share2 } from "lucide-react";

const FOOTER_COLUMNS = [
  {
    title: "Product",
    links: [
      { label: "Investment Plans", href: "/plans" },
      { label: "Stocks", href: "/stocks" },
      { label: "How it works", href: "/about" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About us", href: "/about" },
      { label: "FAQ", href: "/faq" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Terms of Service", href: "/terms" },
      { label: "Privacy Policy", href: "/privacy" },
    ],
  },
];

// Using generic, version-stable icons rather than brand-specific ones
// (Twitter/Github/Linkedin) — those get renamed or dropped across
// lucide-react versions, which is likely why only one of the four icons
// rendered last time.
const SOCIALS = [
  { icon: Mail, href: "mailto:support@ledger.app", label: "Email" },
  { icon: Globe, href: "#", label: "Website" },
  { icon: MessageCircle, href: "#", label: "Chat" },
  { icon: Share2, href: "#", label: "Share" },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-emerald-400/20 bg-gradient-to-b from-[#0B2A1F] to-[#0E1A17]">
      <div className="container py-12 sm:py-16">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          {/* Brand column — centered on mobile, left-aligned as a grid column from sm: up */}
          <div className="flex flex-col items-center space-y-4 text-center sm:items-start sm:text-left">
            <Link href="/" className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-400 shadow-[0_0_20px_rgba(52,211,153,0.4)]">
                <TrendingUp className="h-4 w-4 text-[#0B241B]" />
              </span>
              <span className="font-display text-lg font-bold tracking-tight text-white">
                Ledger<span className="text-emerald-300">.</span>
              </span>
            </Link>
            <p className="max-w-xs text-sm leading-relaxed text-white/55">
              Curated stock-themed investment plans, funded in crypto, reconciled like a ledger.
            </p>
            <div className="flex items-center gap-2 pt-1">
              {SOCIALS.map((s) => (
                <Link
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-400/15 text-emerald-300 transition-colors hover:bg-emerald-400/25 hover:text-emerald-200"
                >
                  <s.icon className="h-4 w-4" />
                </Link>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {FOOTER_COLUMNS.map((col) => (
            <div key={col.title} className="text-center sm:text-left">
              <h3 className="text-xs font-semibold uppercase tracking-widest text-emerald-300">{col.title}</h3>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-sm text-white/60 transition-colors hover:text-white">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-emerald-400/20 pt-6 text-center sm:flex-row sm:text-left">
          <p className="text-xs text-white/45">© {new Date().getFullYear()} Ledger Capital. All rights reserved.</p>
          <p className="text-xs text-white/45">Plans are platform-determined · returns are not brokered against real markets.</p>
        </div>
      </div>
    </footer>
  );
}