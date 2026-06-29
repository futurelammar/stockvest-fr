"use client";

import { useQuery } from "@tanstack/react-query";
import { adminApi } from "@/lib/admin-api"; 
import type { AdminOverview, RecentActivity } from "@/types/admin";

export function useAdminOverview() {
  return useQuery({
    queryKey: ["admin", "overview"],
    queryFn: async () => {
      const { data } = await adminApi.get<AdminOverview>(
        "/admin/dashboard/overview"
      );
      return data;
    },
  });
}

export function useAdminRecentActivity(limit = 5) {
  return useQuery({
    queryKey: ["admin", "recent-activity", limit],
    queryFn: async () => {
      const { data } = await adminApi.get<RecentActivity>(
        "/admin/dashboard/recent-activity",
        { params: { limit } }
      );
      return data;
    },
  });
}