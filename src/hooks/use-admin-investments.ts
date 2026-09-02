"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { adminApi } from "@/lib/admin-api";
import type { PaginatedResponse } from "@/types/stock";

export interface AdminInvestment {
  _id: string;
  amountInvested: number;
  roiPercentage: number;
  durationInDays: number;
  startDate: string;
  maturityDate: string;
  status: "active" | "completed" | "cancelled" | "paused";
  expectedProfit: number;
  profitCredited: boolean;
  pausedAt?: string;
  pausedRemainingMs?: number;
  createdAt: string;
  user?: { _id: string; fullName: string; email: string };
  plan?: {
    _id: string;
    planName: string;
    roiPercentage: number;
    durationInDays: number;
    stock?: { name: string; ticker: string; logoUrl?: string; currentPrice: number };
  };
}

export interface AdjustDatesPayload {
  startDate?: string;
  maturityDate?: string;
}

export interface CreateInvestmentPayload {
  userId: string;
  planId: string;
  amount: number;
  startDate?: string;
  deductFromBalance?: boolean;
}

export interface CreditProfitPayload {
  amount: number;
  reason: string;
}

interface QueryAdminInvestmentsParams {
  page?: number;
  limit?: number;
  status?: string;
}

export function useAdminInvestments(params: QueryAdminInvestmentsParams = {}) {
  return useQuery({
    queryKey: ["admin", "investments", params],
    queryFn: async () => {
      const { data } = await adminApi.get<PaginatedResponse<AdminInvestment>>(
        "/investments/admin/all",
        { params },
      );
      return data;
    },
  });
}

export function usePauseInvestment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      adminApi.patch(`/investments/admin/${id}/pause`).then((r) => r.data),
    onSuccess: () => {
      toast.success("Investment paused — countdown on hold.");
      queryClient.invalidateQueries({ queryKey: ["admin", "investments"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "overview"] });
    },
    onError: (err: any) =>
      toast.error(err?.response?.data?.message || "Failed to pause investment."),
  });
}

export function useResumeInvestment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      adminApi.patch(`/investments/admin/${id}/resume`).then((r) => r.data),
    onSuccess: () => {
      toast.success("Investment resumed.");
      queryClient.invalidateQueries({ queryKey: ["admin", "investments"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "overview"] });
    },
    onError: (err: any) =>
      toast.error(err?.response?.data?.message || "Failed to resume investment."),
  });
}

export function useCancelInvestment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      adminApi.patch(`/investments/admin/${id}/cancel`).then((r) => r.data),
    onSuccess: () => {
      toast.success("Investment cancelled — principal refunded.");
      queryClient.invalidateQueries({ queryKey: ["admin", "investments"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "overview"] });
    },
    onError: (err: any) =>
      toast.error(err?.response?.data?.message || "Failed to cancel investment."),
  });
}

export function useAdjustInvestmentDates(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: AdjustDatesPayload) =>
      adminApi
        .patch(`/investments/admin/${id}/adjust-dates`, payload)
        .then((r) => r.data),
    onSuccess: () => {
      toast.success("Investment dates updated.");
      queryClient.invalidateQueries({ queryKey: ["admin", "investments"] });
    },
    onError: (err: any) =>
      toast.error(err?.response?.data?.message || "Failed to adjust dates."),
  });
}

export function useCreateInvestment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateInvestmentPayload) =>
      adminApi.post(`/investments/admin/create`, payload).then((r) => r.data),
    onSuccess: () => {
      toast.success("Investment created for user.");
      queryClient.invalidateQueries({ queryKey: ["admin", "investments"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "overview"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "user"] });
    },
    onError: (err: any) =>
      toast.error(err?.response?.data?.message || "Failed to create investment."),
  });
}

export function useCreditProfit(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreditProfitPayload) =>
      adminApi.patch(`/investments/admin/${id}/credit-profit`, payload).then((r) => r.data),
    onSuccess: () => {
      toast.success("Profit credited to user balance.");
      queryClient.invalidateQueries({ queryKey: ["admin", "investments"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "overview"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "user"] });
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
    onError: (err: any) =>
      toast.error(err?.response?.data?.message || "Failed to credit profit."),
  });
}