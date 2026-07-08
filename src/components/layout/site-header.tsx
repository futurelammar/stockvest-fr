"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, Moon, Sun, TrendingUp } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { useCurrentUser, useLogout } from "@/hooks/use-auth";

const NAV_LINKS = [
  { href: "/plans", label: "Plans" },
  { href: "/stocks", label: "Stocks" },
];

const NAV_LINKS_RIGHT = [
  { href: "/about", label: "About" },
  { href: "/faq", label: "FAQ" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const { data: user } = useCurrentUser();
  const logout = useLogout();

  const Logo = () => (
    <Link href="/" className="flex items-center gap-2">
      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-400 shadow-[0_0_20px_rgba(52,211,153,0.45)] transition-transform group-hover:scale-105">
        <TrendingUp className="h-4 w-4 text-[#0B241B]" />
      </span>
      <span className="font-display text-lg font-bold tracking-tight text-white sm:text-xl">
        Torq<span style={{ color: "#C0392B" }}>Bridge</span>
      </span>
    </Link>
  );

  return (
    <header className="sticky top-0 z-40 border-b border-emerald-400/20 bg-gradient-to-r from-[#0B2A1F] via-[#1B5E3D] to-[#0B2A1F] backdrop-blur-md">
      {/* Top accent line */}
      <div className="h-[2px] w-full bg-gradient-to-r from-emerald-400 via-[#C9A24B] to-emerald-400" />

      <div className="container relative flex h-16 items-center sm:h-[72px]">
        {/* Left — desktop nav */}
        <div className="hidden flex-1 items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-lg px-3.5 py-2 text-sm font-medium text-white/75 transition-colors hover:bg-white/10 hover:text-white"
            >
              {link.label}
            </Link>
          ))}
        </div>
        {/* Mobile left spacer — keeps the centered logo balanced against the hamburger */}
        <div className="flex flex-1 md:hidden" />

        {/* Center — logo, absolutely centered regardless of side widths */}
        <div className="absolute left-1/2 -translate-x-1/2">
          <Logo />
        </div>

        {/* Right — remaining nav + actions */}
        <div className="flex flex-1 items-center justify-end gap-1">
          <div className="hidden items-center gap-1 md:flex">
            {NAV_LINKS_RIGHT.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-lg px-3.5 py-2 text-sm font-medium text-white/75 transition-colors hover:bg-white/10 hover:text-white"
              >
                {link.label}
              </Link>
            ))}

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="ml-1 text-white/70 hover:bg-white/10 hover:text-white"
            >
              <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            </Button>

            {user ? (
              <>
                <Button asChild className="border border-emerald-300/40 bg-white/10 text-white hover:bg-white/20">
                  <Link href="/dashboard">Dashboard</Link>
                </Button>
                <Button variant="ghost" onClick={() => logout.mutate()} className="text-white/75 hover:bg-white/10 hover:text-white">
                  Sign out
                </Button>
              </>
            ) : (
              <>
                <Button asChild variant="ghost" className="text-white/75 hover:bg-white/10 hover:text-white">
                  <Link href="/login">Sign in</Link>
                </Button>
                <Button
                  asChild
                  className="bg-emerald-400 font-semibold text-[#0B241B] shadow-md transition-all hover:bg-emerald-300 hover:shadow-lg active:scale-[0.97]"
                >
                  <Link href="/register">Get started</Link>
                </Button>
              </>
            )}
          </div>

          <button
            className="flex h-9 w-9 items-center justify-center rounded-lg text-white transition-colors hover:bg-white/10 md:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="animate-in fade-in slide-in-from-top-2 border-t border-emerald-400/20 bg-[#0B2A1F] px-4 pb-6 pt-4 duration-200 md:hidden">
          <nav className="flex flex-col gap-1">
            {[...NAV_LINKS, ...NAV_LINKS_RIGHT].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-white/75 transition-colors hover:bg-white/10 hover:text-white"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            ))}

            <div className="my-2 flex items-center justify-between rounded-lg px-3 py-2">
              <span className="text-sm font-medium text-white/75">Theme</span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="text-white/70 hover:bg-white/10 hover:text-white"
              >
                <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              </Button>
            </div>

            <div className="mt-1 flex flex-col gap-2 border-t border-emerald-400/20 pt-3">
              {user ? (
                <>
                  <Button asChild className="border border-emerald-300/40 bg-white/10 text-white hover:bg-white/20">
                    <Link href="/dashboard/overview">Dashboard</Link>
                  </Button>
                  <Button variant="ghost" onClick={() => logout.mutate()} className="text-white/75 hover:bg-white/10 hover:text-white">
                    Sign out
                  </Button>
                </>
              ) : (
                <>
                  <Button asChild variant="ghost" className="text-white/75 hover:bg-white/10 hover:text-white">
                    <Link href="/login">Sign in</Link>
                  </Button>
                  <Button asChild className="bg-emerald-400 font-semibold text-[#0B241B] shadow-md hover:bg-emerald-300">
                    <Link href="/register">Get started</Link>
                  </Button>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}