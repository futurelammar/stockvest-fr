"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { InvestmentPlan, PaginatedResponse } from "@/types/stock";

interface UsePlansParams {
  search?: string;
  stockId?: string;
  page?: number;
  limit?: number;
}

export function usePlans(params: UsePlansParams = {}) {
  return useQuery({
    queryKey: ["plans", params],
    queryFn: async () => {
      const { data } = await api.get<PaginatedResponse<InvestmentPlan>>("/investment-plans", { params });
      return data;
    },
    staleTime: 60 * 1000,
  });
}