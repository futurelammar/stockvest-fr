"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { PaginatedResponse } from "@/types/stock";
import type { Transaction, TransactionSummary } from "@/types/transaction";

export function useTransactionSummary() {
  return useQuery({
    queryKey: ["transactions", "summary"],
    queryFn: async () => {
      const { data } = await api.get<TransactionSummary>("/transactions/me/summary");
      return data;
    },
  });
}

export function useTransactions(params: { page?: number; limit?: number; type?: string } = {}) {
  return useQuery({
    queryKey: ["transactions", params],
    queryFn: async () => {
      const { data } = await api.get<PaginatedResponse<Transaction>>("/transactions/me", { params });
      return data;
    },
  });
}