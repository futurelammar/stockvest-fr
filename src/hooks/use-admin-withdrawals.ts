"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { adminApi } from "@/lib/admin-api";
import type { PaginatedResponse } from "@/types/stock";

export interface AdminWithdrawal {
  _id: string;
  amount: number;
  status: "pending" | "approved" | "rejected" | "paid";
  coinType: string;
  network: string;
  walletAddress: string;
  adminNote?: string;
  paidAt?: string;
  createdAt: string;
  updatedAt: string;
  user?: { _id: string; fullName: string; email: string; balance: number };
  reviewedBy?: string;
}

interface QueryAdminWithdrawalsParams {
  page?: number;
  limit?: number;
  status?: "pending" | "approved" | "rejected" | "paid";
}

export function useAdminWithdrawals(params: QueryAdminWithdrawalsParams = {}) {
  return useQuery({
    queryKey: ["admin", "withdrawals", params],
    queryFn: async () => {
      const { data } = await adminApi.get<PaginatedResponse<AdminWithdrawal>>(
        "/withdrawals/admin/all",
        { params },
      );
      return data;
    },
    refetchInterval: 30 * 1000,
  });
}

export function useApproveWithdrawal() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      adminApi.patch(`/withdrawals/admin/${id}/approve`).then((r) => r.data),
    onSuccess: () => {
      toast.success("Withdrawal approved.");
      queryClient.invalidateQueries({ queryKey: ["admin", "withdrawals"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "overview"] });
    },
    onError: (err: any) =>
      toast.error(err?.response?.data?.message || "Failed to approve withdrawal."),
  });
}

export function useRejectWithdrawal() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, adminNote }: { id: string; adminNote?: string }) =>
      adminApi
        .patch(`/withdrawals/admin/${id}/reject`, { adminNote })
        .then((r) => r.data),
    onSuccess: () => {
      toast.success("Withdrawal rejected — balance refunded to user.");
      queryClient.invalidateQueries({ queryKey: ["admin", "withdrawals"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "overview"] });
    },
    onError: (err: any) =>
      toast.error(err?.response?.data?.message || "Failed to reject withdrawal."),
  });
}

export function useMarkWithdrawalPaid() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      adminApi.patch(`/withdrawals/admin/${id}/mark-paid`).then((r) => r.data),
    onSuccess: () => {
      toast.success("Withdrawal marked as paid.");
      queryClient.invalidateQueries({ queryKey: ["admin", "withdrawals"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "overview"] });
    },
    onError: (err: any) =>
      toast.error(err?.response?.data?.message || "Failed to mark as paid."),
  });
}