"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { adminApi } from "@/lib/admin-api";
import type { Stock, PaginatedResponse } from "@/types/stock";

interface QueryAdminStocksParams {
  page?: number;
  limit?: number;
  search?: string;
  isCustom?: boolean;
}

export interface StockFormPayload {
  name: string;
  ticker: string;
  sector?: string;
  isCustom: boolean;
  currentPrice?: number;
  logoFile?: File;
}

export interface UpdateCustomStockPayload {
  name?: string;
  sector?: string;
  currentPrice?: number;
  status?: "active" | "inactive";
  logoFile?: File;
}

function buildStockFormData(payload: StockFormPayload) {
  const fd = new FormData();
  fd.append("name", payload.name);
  fd.append("ticker", payload.ticker.toUpperCase());
  fd.append("isCustom", String(payload.isCustom));
  if (payload.sector) fd.append("sector", payload.sector);
  if (payload.currentPrice !== undefined) fd.append("currentPrice", String(payload.currentPrice));
  if (payload.logoFile) fd.append("logo", payload.logoFile);
  return fd;
}

function buildUpdateFormData(payload: UpdateCustomStockPayload) {
  const fd = new FormData();
  if (payload.name) fd.append("name", payload.name);
  if (payload.sector) fd.append("sector", payload.sector);
  if (payload.currentPrice !== undefined) fd.append("currentPrice", String(payload.currentPrice));
  if (payload.status) fd.append("status", payload.status);
  if (payload.logoFile) fd.append("logo", payload.logoFile);
  return fd;
}

export function useAdminStocks(params: QueryAdminStocksParams = {}) {
  return useQuery({
    queryKey: ["admin", "stocks", params],
    queryFn: async () => {
      const { data } = await adminApi.get<PaginatedResponse<Stock>>("/stocks/admin/all", { params });
      return data;
    },
    refetchInterval: 60 * 1000, // refresh every minute so live prices stay current
  });
}

export function useCreateStock() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: StockFormPayload) =>
      adminApi
        .post<Stock>("/stocks", buildStockFormData(payload), {
          headers: { "Content-Type": "multipart/form-data" },
        })
        .then((r) => r.data),
    onSuccess: (data) => {
      toast.success(`${data.ticker} added.`);
      queryClient.invalidateQueries({ queryKey: ["admin", "stocks"] });
      queryClient.invalidateQueries({ queryKey: ["stocks"] });
    },
    onError: (err: any) =>
      toast.error(err?.response?.data?.message || "Failed to add stock."),
  });
}

export function useUpdateStock(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateCustomStockPayload) =>
      adminApi
        .patch<Stock>(`/stocks/${id}`, buildUpdateFormData(payload), {
          headers: { "Content-Type": "multipart/form-data" },
        })
        .then((r) => r.data),
    onSuccess: (data) => {
      toast.success(`${data.ticker} updated.`);
      queryClient.invalidateQueries({ queryKey: ["admin", "stocks"] });
      queryClient.invalidateQueries({ queryKey: ["stocks"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "stocks", "picker"] });
    },
    onError: (err: any) =>
      toast.error(err?.response?.data?.message || "Failed to update stock."),
  });
}

export function useDisableStock() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminApi.delete(`/stocks/${id}`).then((r) => r.data),
    onSuccess: () => {
      toast.success("Stock disabled.");
      queryClient.invalidateQueries({ queryKey: ["admin", "stocks"] });
      queryClient.invalidateQueries({ queryKey: ["stocks"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "stocks", "picker"] });
    },
    onError: (err: any) =>
      toast.error(err?.response?.data?.message || "Failed to disable stock."),
  });
}