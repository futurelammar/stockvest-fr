"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  ShieldOff,
  Lock,
  BadgeCheck,
  ShieldAlert,
  Users,
  ChevronDown,
} from "lucide-react";
import { useAdminUsersList } from "@/hooks/use-admin-users";
import { useDebouncedValue } from "@/hooks/use-debounced-value";

function formatMoney(n: number | undefined) {
  return `$${(n ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}

function SkeletonRow() {
  return (
    <div className="flex animate-pulse items-center gap-4 border-b border-[#F1EDE2] px-5 py-4 last:border-0">
      <div className="h-9 w-9 rounded-full bg-[#E5E0D4]" />
      <div className="flex-1 space-y-2">
        <div className="h-3.5 w-32 rounded bg-[#E5E0D4]" />
        <div className="h-2.5 w-44 rounded bg-[#E5E0D4]" />
      </div>
      <div className="h-3.5 w-16 rounded bg-[#E5E0D4]" />
    </div>
  );
}

type RoleFilter = "all" | "user" | "admin";
type StatusFilter = "all" | "active" | "blocked";

export default function AdminUsersPage() {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<RoleFilter>("all");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [page, setPage] = useState(1);
  const LIMIT = 15;

  const debouncedSearch = useDebouncedValue(search);

  const { data, isLoading } = useAdminUsersList({
    page,
    limit: LIMIT,
    search: debouncedSearch || undefined,
    role: roleFilter !== "all" ? roleFilter : undefined,
    isActive: statusFilter === "all" ? undefined : statusFilter === "active",
  });

  const users = data?.data ?? [];
  const totalPages = data?.meta.totalPages ?? 1;

  function handleSearchChange(value: string) {
    setSearch(value);
    setPage(1);
  }

  function handleRoleChange(value: RoleFilter) {
    setRoleFilter(value);
    setPage(1);
  }

  function handleStatusChange(value: StatusFilter) {
    setStatusFilter(value);
    setPage(1);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-[#0E1A17]">Users</h1>
        <p className="mt-0.5 text-sm text-[#5B6661]">Manage accounts, balances, and access across the platform.</p>
      </div>

      {/* ── Filters ── */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1 sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#B0AAA0]" />
          <input
            type="text"
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="Search by name or email…"
            className="w-full rounded-lg border border-[#D6D0C4] bg-white py-2.5 pl-9 pr-3 text-sm text-[#0E1A17] outline-none focus:border-[#1F6F4F]"
          />
        </div>

        <div className="relative">
          <select
            value={roleFilter}
            onChange={(e) => handleRoleChange(e.target.value as RoleFilter)}
            className="appearance-none rounded-lg border border-[#D6D0C4] bg-white py-2.5 pl-3 pr-9 text-sm text-[#0E1A17] outline-none focus:border-[#1F6F4F]"
          >
            <option value="all">All roles</option>
            <option value="user">Users</option>
            <option value="admin">Admins</option>
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#B0AAA0]" />
        </div>

        <div className="relative">
          <select
            value={statusFilter}
            onChange={(e) => handleStatusChange(e.target.value as StatusFilter)}
            className="appearance-none rounded-lg border border-[#D6D0C4] bg-white py-2.5 pl-3 pr-9 text-sm text-[#0E1A17] outline-none focus:border-[#1F6F4F]"
          >
            <option value="all">All statuses</option>
            <option value="active">Active</option>
            <option value="blocked">Blocked</option>
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#B0AAA0]" />
        </div>

        {data?.meta && <span className="ml-auto text-xs text-[#5B6661] sm:ml-0">{data.meta.total} users</span>}
      </div>

      {/* ── Table ── */}
      <div className="rounded-xl border border-[#E5E0D4] bg-white">
        <div className="hidden grid-cols-[1fr_120px_120px_140px_110px] items-center gap-4 border-b border-[#F1EDE2] px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-[#5B6661] lg:grid">
          <span>User</span>
          <span>Role</span>
          <span>Balance</span>
          <span>Status</span>
          <span>Joined</span>
        </div>

        <div>
          {isLoading && Array.from({ length: 8 }).map((_, i) => <SkeletonRow key={i} />)}

          {!isLoading && users.length === 0 && (
            <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#F7F4EE]">
                <Users className="h-7 w-7 text-[#5B6661]" />
              </div>
              <p className="mt-4 font-display text-lg font-semibold text-[#0E1A17]">No users found</p>
              <p className="mt-1 max-w-xs text-sm text-[#5B6661]">
                Try adjusting your search or filters.
              </p>
            </div>
          )}

          {!isLoading &&
            users.map((u) => (
              <Link
                key={u._id}
                href={`users/${u._id}`}
                className="grid grid-cols-1 gap-2 border-b border-[#F1EDE2] px-5 py-4 last:border-0 transition-colors hover:bg-[#FAFAF7] lg:grid-cols-[1fr_120px_120px_140px_110px] lg:items-center lg:gap-4"
              >
                {/* User */}
                <div className="flex items-center gap-3 min-w-0">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#0E1A17] text-xs font-bold text-emerald-400">
                    {u.fullName?.slice(0, 1).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-[#0E1A17]">{u.fullName}</p>
                    <p className="truncate text-xs text-[#5B6661]">{u.email}</p>
                  </div>
                </div>

                {/* Role */}
                <div>
                  <span
                    className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${
                      u.role === "admin" ? "bg-[#C9A24B]/15 text-[#9c7f3a]" : "bg-[#F7F4EE] text-[#5B6661]"
                    }`}
                  >
                    {u.role}
                  </span>
                </div>

                {/* Balance */}
                <p className="font-mono text-sm font-medium text-[#0E1A17]">{formatMoney(u.balance)}</p>

                {/* Status */}
                <div className="flex flex-wrap items-center gap-1.5">
                  {!u.isActive ? (
                    <span className="flex items-center gap-1 rounded-full bg-rose-50 px-2 py-0.5 text-[10px] font-bold text-[#A8392F]">
                      <ShieldOff className="h-2.5 w-2.5" /> Blocked
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-[10px] font-medium text-[#1F6F4F]">
                      <BadgeCheck className="h-2.5 w-2.5" /> Active
                    </span>
                  )}
                  {u.withdrawalsBlocked && (
                    <span className="flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-700">
                      <Lock className="h-2.5 w-2.5" /> WD blocked
                    </span>
                  )}
                  {!u.isEmailVerified && (
                    <span className="flex items-center gap-1 text-[10px] font-medium text-amber-700">
                      <ShieldAlert className="h-2.5 w-2.5" /> Unverified
                    </span>
                  )}
                </div>

                {/* Joined */}
                <p className="text-xs text-[#5B6661]">{fmtDate(u.createdAt)}</p>
              </Link>
            ))}
        </div>

        {/* Pagination */}
        {!isLoading && totalPages > 1 && (
          <div className="flex flex-wrap items-center justify-between gap-4 border-t border-[#E5E0D4] px-5 py-4">
            <p className="text-xs text-[#5B6661]">
              Page {page} of {totalPages} · {data?.meta.total} users
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#E5E0D4] text-[#5B6661] transition-colors hover:border-[#1F6F4F] hover:text-[#1F6F4F] disabled:pointer-events-none disabled:opacity-40"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
                .reduce<(number | "…")[]>((acc, p, i, arr) => {
                  if (i > 0 && p - (arr[i - 1] as number) > 1) acc.push("…");
                  acc.push(p);
                  return acc;
                }, [])
                .map((p, i) =>
                  p === "…" ? (
                    <span key={`e-${i}`} className="px-1 text-xs text-[#5B6661]">
                      …
                    </span>
                  ) : (
                    <button
                      key={p}
                      onClick={() => setPage(p as number)}
                      className={`flex h-8 w-8 items-center justify-center rounded-lg text-sm font-medium transition-colors ${
                        page === p
                          ? "bg-[#0E1A17] text-white"
                          : "border border-[#E5E0D4] text-[#5B6661] hover:border-[#1F6F4F] hover:text-[#1F6F4F]"
                      }`}
                    >
                      {p}
                    </button>
                  ),
                )}

              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#E5E0D4] text-[#5B6661] transition-colors hover:border-[#1F6F4F] hover:text-[#1F6F4F] disabled:pointer-events-none disabled:opacity-40"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}