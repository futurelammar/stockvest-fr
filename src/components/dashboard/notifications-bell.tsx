"use client";

import { useState, useRef, useEffect } from "react";
import { Bell } from "lucide-react";
import Link from "next/link";
import { useNotifications, useMarkNotificationRead } from "@/hooks/use-notifications";

export function NotificationsBell() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { data } = useNotifications({ limit: 5 });
  const markRead = useMarkNotificationRead();

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const unread = data?.meta?.unreadCount ?? 0;

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="relative flex h-9 w-9 items-center justify-center rounded-full border border-[#E5E0D4] bg-white hover:bg-[#F1EDE2]"
        aria-label="Notifications"
      >
        <Bell className="h-4 w-4 text-[#0E1A17]" />
        {unread > 0 && (
          <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#A8392F] px-1 text-[10px] font-semibold text-white">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 w-80 rounded-lg border border-[#E5E0D4] bg-white p-2 shadow-lg">
          <div className="flex items-center justify-between px-2 py-1.5">
            <p className="text-sm font-medium text-[#0E1A17]">Notifications</p>
            <Link href="/dashboard/transactions" onClick={() => setOpen(false)} className="text-xs text-[#1F6F4F] hover:underline">
              View all
            </Link>
          </div>

          {(!data || data.data.length === 0) && (
            <p className="px-2 py-6 text-center text-xs text-[#5B6661]">No notifications yet.</p>
          )}

          <div className="max-h-80 overflow-y-auto">
            {data?.data.map((n) => (
              <button
                key={n._id}
                onClick={() => !n.isRead && markRead.mutate(n._id)}
                className={`block w-full rounded-md px-2 py-2 text-left text-sm transition-colors hover:bg-[#F1EDE2] ${
                  n.isRead ? "" : "bg-[#1F6F4F]/5"
                }`}
              >
                <p className="font-medium text-[#0E1A17]">{n.title}</p>
                <p className="mt-0.5 line-clamp-2 text-xs text-[#5B6661]">{n.message}</p>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}