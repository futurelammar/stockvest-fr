"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Settings, LogOut, ChevronDown } from "lucide-react";
import { useLogout } from "@/hooks/use-auth";
import type { AuthUser } from "@/types/auth";

export function UserMenu({ user }: { user: AuthUser }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const logout = useLogout();

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const initials = user.fullName.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 rounded-full border border-[#E5E0D4] bg-white px-2 py-1.5 pr-3 hover:bg-[#F1EDE2]"
      >
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#1F6F4F] text-xs font-semibold text-white">
          {initials}
        </span>
        <span className="hidden text-sm font-medium text-[#0E1A17] sm:inline">{user.fullName.split(" ")[0]}</span>
        <ChevronDown className="h-3.5 w-3.5 text-[#5B6661]" />
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 w-52 rounded-lg border border-[#E5E0D4] bg-white p-1.5 shadow-lg">
          <div className="border-b border-[#F1EDE2] px-3 py-2">
            <p className="truncate text-sm font-medium text-[#0E1A17]">{user.fullName}</p>
            <p className="truncate text-xs text-[#5B6661]">{user.email}</p>
          </div>
          <Link
            href="/dashboard/settings"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-[#0E1A17] hover:bg-[#F1EDE2]"
          >
            <Settings className="h-4 w-4" /> Settings
          </Link>
          <button
            onClick={() => logout.mutate()}
            className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-[#A8392F] hover:bg-[#A8392F]/5"
          >
            <LogOut className="h-4 w-4" /> Sign out
          </button>
        </div>
      )}
    </div>
  );
}