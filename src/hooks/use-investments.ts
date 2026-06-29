"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { PaginatedResponse } from "@/types/stock";
import type { Investment } from "@/types/investment";

export function useMyInvestments(params: { page?: number; limit?: number; status?: string } = {}) {
  return useQuery({
    queryKey: ["investments", "me", params],
    queryFn: async () => {
      const { data } = await api.get<PaginatedResponse<Investment>>("/investments/me", { params });
      return data;
    },
  });
}