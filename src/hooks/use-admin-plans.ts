"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { adminApi } from "@/lib/admin-api";
import type { InvestmentPlan, PaginatedResponse, Stock } from "@/types/stock";

interface QueryAdminPlansParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: "active" | "inactive";
}

export interface PlanFormPayload {
  planName: string;
  description: string;
  stockId: string;
  durationInDays: number;
  roiPercentage: number;
  minimumInvestment: number;
  maximumInvestment: number;
  status?: "active" | "inactive";
  featuredImage?: File;
}

function buildPlanFormData(payload: PlanFormPayload) {
  const formData = new FormData();
  formData.append("planName", payload.planName);
  formData.append("description", payload.description);
  formData.append("stockId", payload.stockId);
  formData.append("durationInDays", String(payload.durationInDays));
  formData.append("roiPercentage", String(payload.roiPercentage));
  formData.append("minimumInvestment", String(payload.minimumInvestment));
  formData.append("maximumInvestment", String(payload.maximumInvestment));
  if (payload.status) formData.append("status", payload.status);
  if (payload.featuredImage) formData.append("featuredImage", payload.featuredImage);
  return formData;
}

export function useAdminPlans(params: QueryAdminPlansParams = {}) {
  return useQuery({
    queryKey: ["admin", "plans", params],
    queryFn: async () => {
      const { data } = await adminApi.get<PaginatedResponse<InvestmentPlan>>("/investment-plans/admin/all", {
        params,
      });
      return data;
    },
  });
}

// Active stocks only — used to populate the stock picker when creating/editing a plan
export function useAdminStocksForPicker() {
  return useQuery({
    queryKey: ["admin", "stocks", "picker"],
    queryFn: async () => {
      const { data } = await adminApi.get<PaginatedResponse<Stock>>("/stocks/admin/all", {
        params: { limit: 100, isCustom: undefined },
      });
      return data.data.filter((s) => s.status === "active");
    },
  });
}

export function useCreatePlan() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: PlanFormPayload) =>
      adminApi
        .post<InvestmentPlan>("/investment-plans", buildPlanFormData(payload), {
          headers: { "Content-Type": "multipart/form-data" },
        })
        .then((r) => r.data),
    onSuccess: () => {
      toast.success("Plan created.");
      queryClient.invalidateQueries({ queryKey: ["admin", "plans"] });
      queryClient.invalidateQueries({ queryKey: ["plans"] });
    },
    onError: (err: any) => toast.error(err?.response?.data?.message || "Failed to create plan."),
  });
}

export function useUpdatePlan(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Partial<PlanFormPayload>) =>
      adminApi
        .patch<InvestmentPlan>(`/investment-plans/${id}`, buildPlanFormData(payload as PlanFormPayload), {
          headers: { "Content-Type": "multipart/form-data" },
        })
        .then((r) => r.data),
    onSuccess: () => {
      toast.success("Plan updated.");
      queryClient.invalidateQueries({ queryKey: ["admin", "plans"] });
      queryClient.invalidateQueries({ queryKey: ["plans"] });
    },
    onError: (err: any) => toast.error(err?.response?.data?.message || "Failed to update plan."),
  });
}

export function useDeactivatePlan() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminApi.delete(`/investment-plans/${id}`).then((r) => r.data),
    onSuccess: () => {
      toast.success("Plan deactivated.");
      queryClient.invalidateQueries({ queryKey: ["admin", "plans"] });
      queryClient.invalidateQueries({ queryKey: ["plans"] });
    },
    onError: (err: any) => toast.error(err?.response?.data?.message || "Failed to deactivate plan."),
  });
}