"use client";

import { Menu, LogOut } from "lucide-react";
import { useAdminLogout } from "@/hooks/use-admin-auth";
import type { AdminUser } from "@/types/admin";

export function AdminTopbar({
  user,
  onMenuClick,
}: {
  user: AdminUser;
  onMenuClick: () => void;
}) {
  // useAdminLogout returns a plain function — call it directly
  const logout = useAdminLogout();

  return (
    <header className="flex h-16 items-center justify-between border-b border-[#E5E0D4] bg-white px-4 sm:px-6">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-[#5B6661] hover:bg-[#F7F4EE] lg:hidden"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </button>
        <div>
          <p className="text-sm font-semibold text-[#0E1A17]">Admin Panel</p>
          <p className="text-xs text-[#5B6661]">Manage your platform</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden text-right sm:block">
          <p className="text-sm font-medium text-[#0E1A17]">{user.fullName}</p>
          <p className="text-xs text-[#5B6661]">{user.email}</p>
        </div>
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#1F6F4F] text-sm font-bold text-white">
          {user.fullName?.slice(0, 1).toUpperCase()}
        </div>
        <button
          onClick={logout} 
          className="flex h-9 w-9 items-center justify-center rounded-lg text-[#5B6661] transition-colors hover:bg-rose-50 hover:text-[#A8392F]"
          aria-label="Sign out"
        >
          <LogOut className="h-4 w-4" />
        </button>
      </div>
    </header>
  );
}