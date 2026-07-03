"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { adminApi } from "@/lib/admin-api";

export interface AdminWallet {
  _id: string;
  coinName: string;
  network: string;
  walletAddress: string;
  qrCodeImage?: string;
  status: "active" | "disabled";
  createdAt: string;
}

export interface WalletFormPayload {
  coinName: string;
  network: string;
  walletAddress: string;
  qrCode?: File;
}

export interface UpdateWalletPayload {
  coinName?: string;
  network?: string;
  walletAddress?: string;
  status?: "active" | "disabled";
  qrCode?: File;
}

function buildWalletFormData(payload: WalletFormPayload | UpdateWalletPayload) {
  const fd = new FormData();
  if ("coinName" in payload && payload.coinName) fd.append("coinName", payload.coinName);
  if ("network" in payload && payload.network) fd.append("network", payload.network);
  if ("walletAddress" in payload && payload.walletAddress)
    fd.append("walletAddress", payload.walletAddress);
  if ("status" in payload && payload.status) fd.append("status", payload.status);
  if (payload.qrCode) fd.append("qrCode", payload.qrCode);
  return fd;
}

export function useAdminWallets() {
  return useQuery({
    queryKey: ["admin", "wallets"],
    queryFn: async () => {
      const { data } = await adminApi.get<AdminWallet[]>("/wallets/admin/all");
      return data;
    },
  });
}

export function useCreateWallet() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: WalletFormPayload) =>
      adminApi
        .post<AdminWallet>("/wallets", buildWalletFormData(payload), {
          headers: { "Content-Type": "multipart/form-data" },
        })
        .then((r) => r.data),
    onSuccess: (data) => {
      toast.success(`${data.coinName} wallet added.`);
      queryClient.invalidateQueries({ queryKey: ["admin", "wallets"] });
      queryClient.invalidateQueries({ queryKey: ["wallets"] });
    },
    onError: (err: any) =>
      toast.error(err?.response?.data?.message || "Failed to create wallet."),
  });
}

export function useUpdateWallet(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateWalletPayload) =>
      adminApi
        .patch<AdminWallet>(`/wallets/${id}`, buildWalletFormData(payload), {
          headers: { "Content-Type": "multipart/form-data" },
        })
        .then((r) => r.data),
    onSuccess: (data) => {
      toast.success(`${data.coinName} wallet updated.`);
      queryClient.invalidateQueries({ queryKey: ["admin", "wallets"] });
      queryClient.invalidateQueries({ queryKey: ["wallets"] });
    },
    onError: (err: any) =>
      toast.error(err?.response?.data?.message || "Failed to update wallet."),
  });
}

export function useDisableWallet() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      adminApi.delete(`/wallets/${id}`).then((r) => r.data),
    onSuccess: () => {
      toast.success("Wallet disabled.");
      queryClient.invalidateQueries({ queryKey: ["admin", "wallets"] });
      queryClient.invalidateQueries({ queryKey: ["wallets"] });
    },
    onError: (err: any) =>
      toast.error(err?.response?.data?.message || "Failed to disable wallet."),
  });
}