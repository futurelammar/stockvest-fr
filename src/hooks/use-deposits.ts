
"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { toast } from "sonner";
import type { Deposit, PaginatedDeposits, Wallet, CreateDepositDto } from "@/types/deposit";

/* ─── Wallets ─── */
export function useWallets() {
  return useQuery<Wallet[]>({
    queryKey: ["wallets"],
    queryFn: async () => {
      const { data } = await api.get<Wallet[]>("/wallets");
      return data;
    },
  });
}

/* ─── My deposits ─── */
export function useMyDeposits(params: { page?: number; limit?: number } = {}) {
  return useQuery<PaginatedDeposits>({
    queryKey: ["deposits", "me", params],
    queryFn: async () => {
      const { data } = await api.get<PaginatedDeposits>("/deposits/me", { params });
      return data;
    },
  });
}

/* ─── Upload proof image ─── */
export function useUploadProof() {
  return useMutation<{ url: string }, Error, File>({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("file", file);
      const { data } = await api.post<{ url: string }>("/uploads/image", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return data;
    },
    onError: () => {
      toast.error("Failed to upload proof image. Please try again.");
    },
  });
}

/* ─── Create deposit ─── */
export function useCreateDeposit() {
  const queryClient = useQueryClient();

  return useMutation<Deposit, Error, CreateDepositDto>({
    mutationFn: async (dto: CreateDepositDto) => {
      const { data } = await api.post<Deposit>("/deposits", dto);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["deposits", "me"] });
      toast.success("Deposit submitted! We'll confirm it within 24 hours.");
    },
    onError: (err: any) => {
      const msg =
        err?.response?.data?.message ?? "Failed to submit deposit. Please try again.";
      toast.error(msg);
    },
  });
}