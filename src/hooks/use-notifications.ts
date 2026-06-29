"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { PaginatedResponse } from "@/types/stock";
import type { Notification } from "@/types/notification";

interface NotificationsResponse extends PaginatedResponse<Notification> {
  meta: PaginatedResponse<Notification>["meta"] & { unreadCount: number };
}

export function useNotifications(params: { page?: number; limit?: number; isRead?: boolean } = {}) {
  return useQuery({
    queryKey: ["notifications", params],
    queryFn: async () => {
      const { data } = await api.get<NotificationsResponse>("/notifications", { params });
      return data;
    },
    refetchInterval: 60 * 1000,
  });
}

export function useMarkNotificationRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await api.patch(`/notifications/${id}/read`);
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["notifications"] }),
  });
}