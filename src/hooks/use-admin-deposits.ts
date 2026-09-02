"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { adminApi } from "@/lib/admin-api";
import type { PaginatedResponse } from "@/types/stock";

export interface AdminDeposit {
  _id: string;
  amount: number;
  status: "pending" | "approved" | "rejected";
  coinName: string;
  network: string;
  proofOfPayment: string;
  adminNote?: string;
  createdAt: string;
  updatedAt: string;
  user?: { _id: string; fullName: string; email: string; balance: number };
  wallet?: { coinName: string; network: string; walletAddress: string };
  reviewedBy?: string;
}

export interface EditDepositPayload {
  amount?: number;
  coinName?: string;
  network?: string;
  createdAt?: string; // ISO string — backdate or frontdate
}

interface QueryAdminDepositsParams {
  page?: number;
  limit?: number;
  status?: "pending" | "approved" | "rejected";
}

export function useAdminDeposits(params: QueryAdminDepositsParams = {}) {
  return useQuery({
    queryKey: ["admin", "deposits", params],
    queryFn: async () => {
      const { data } = await adminApi.get<PaginatedResponse<AdminDeposit>>(
        "/deposits/admin/all",
        { params },
      );
      return data;
    },
    refetchInterval: 30 * 1000,
  });
}

export function useApproveDeposit() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      adminApi.patch(`/deposits/admin/${id}/approve`).then((r) => r.data),
    onSuccess: () => {
      toast.success("Deposit approved and balance credited.");
      queryClient.invalidateQueries({ queryKey: ["admin", "deposits"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "overview"] });
    },
    onError: (err: any) =>
      toast.error(err?.response?.data?.message || "Failed to approve deposit."),
  });
}

export function useRejectDeposit() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, adminNote }: { id: string; adminNote?: string }) =>
      adminApi.patch(`/deposits/admin/${id}/reject`, { adminNote }).then((r) => r.data),
    onSuccess: () => {
      toast.success("Deposit rejected.");
      queryClient.invalidateQueries({ queryKey: ["admin", "deposits"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "overview"] });
    },
    onError: (err: any) =>
      toast.error(err?.response?.data?.message || "Failed to reject deposit."),
  });
}

export function useEditDeposit() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: EditDepositPayload }) =>
      adminApi.patch(`/deposits/admin/${id}/edit`, payload).then((r) => r.data),
    onSuccess: () => {
      toast.success("Deposit updated.");
      queryClient.invalidateQueries({ queryKey: ["admin", "deposits"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "overview"] });
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
    onError: (err: any) =>
      toast.error(err?.response?.data?.message || "Failed to update deposit."),
  });
}