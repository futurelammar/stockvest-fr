"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { Stock, PaginatedResponse } from "@/types/stock";

interface UseStocksParams {
  search?: string;
  page?: number;
  limit?: number;
}

export function useStocks(params: UseStocksParams = {}) {
  return useQuery({
    queryKey: ["stocks", params],
    queryFn: async () => {
      const { data } = await api.get<PaginatedResponse<Stock>>("/stocks", { params });
      return data;
    },
    staleTime: 60 * 1000,
  });
}