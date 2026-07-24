"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { adminApi } from "@/lib/admin-api";
import type { AdminUserDetail, AdjustBalancePayload, BlockPayload, UpdateUserRolePayload, AdminUserListItem, QueryUsersParams } from "../types/admin-user";
import type { PaginatedResponse } from "@/types/stock";
import type { Investment } from "@/types/investment";
import type { Deposit } from "@/types/deposit";
import type { Withdrawal } from "@/types/withdrawal";

export function useAdminUser(id: string) {
  return useQuery({
    queryKey: ["admin", "user", id],
    queryFn: async () => {
      const { data } = await adminApi.get<AdminUserDetail>(`/users/${id}`);
      return data;
    },
    enabled: !!id,
  });
}

export function useAdminUserInvestments(id: string) {
  return useQuery({
    queryKey: ["admin", "user", id, "investments"],
    queryFn: async () => {
      const { data } = await adminApi.get<PaginatedResponse<Investment>>("/investments/admin/all", {
        params: { limit: 100 },
      });
      // Backend doesn't currently support filtering admin/all by userId — filter client-side for now
      return { ...data, data: data.data.filter((inv: any) => inv.user === id || inv.user?._id === id) };
    },
    enabled: !!id,
  });
}

export function useAdminUserDeposits(id: string) {
  return useQuery({
    queryKey: ["admin", "user", id, "deposits"],
    queryFn: async () => {
      const { data } = await adminApi.get<PaginatedResponse<Deposit>>("/deposits/admin/all", {
        params: { limit: 100 },
      });
      return { ...data, data: data.data.filter((d: any) => d.user === id || d.user?._id === id) };
    },
    enabled: !!id,
  });
}

export function useAdminUserWithdrawals(id: string) {
  return useQuery({
    queryKey: ["admin", "user", id, "withdrawals"],
    queryFn: async () => {
      const { data } = await adminApi.get<PaginatedResponse<Withdrawal>>("/withdrawals/admin/all", {
        params: { limit: 100 },
      });
      return { ...data, data: data.data.filter((w: any) => w.user === id || w.user?._id === id) };
    },
    enabled: !!id,
  });
}

function invalidateUser(queryClient: ReturnType<typeof useQueryClient>, id: string) {
  queryClient.invalidateQueries({ queryKey: ["admin", "user", id] });
  queryClient.invalidateQueries({ queryKey: ["admin", "overview"] });
}

export function useBlockUser(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: BlockPayload) => adminApi.patch(`/users/admin/${id}/block`, payload).then((r) => r.data),
    onSuccess: () => {
      toast.success("User blocked.");
      invalidateUser(queryClient, id);
    },
    onError: (err: any) => toast.error(err?.response?.data?.message || "Failed to block user."),
  });
}

export function useUnblockUser(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => adminApi.patch(`/users/admin/${id}/unblock`).then((r) => r.data),
    onSuccess: () => {
      toast.success("User unblocked.");
      invalidateUser(queryClient, id);
    },
    onError: (err: any) => toast.error(err?.response?.data?.message || "Failed to unblock user."),
  });
}

export function useBlockWithdrawals(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: BlockPayload) =>
      adminApi.patch(`/users/admin/${id}/block-withdrawals`, payload).then((r) => r.data),
    onSuccess: () => {
      toast.success("Withdrawals blocked for this user.");
      invalidateUser(queryClient, id);
    },
    onError: (err: any) => toast.error(err?.response?.data?.message || "Failed to block withdrawals."),
  });
}

export function useUnblockWithdrawals(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => adminApi.patch(`/users/admin/${id}/unblock-withdrawals`).then((r) => r.data),
    onSuccess: () => {
      toast.success("Withdrawals restored for this user.");
      invalidateUser(queryClient, id);
    },
    onError: (err: any) => toast.error(err?.response?.data?.message || "Failed to restore withdrawals."),
  });
}

export function useAdjustBalance(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: AdjustBalancePayload) =>
      adminApi.patch(`/users/admin/${id}/adjust-balance`, payload).then((r) => r.data),
    onSuccess: () => {
      toast.success("Balance adjusted.");
      invalidateUser(queryClient, id);
    },
    onError: (err: any) => toast.error(err?.response?.data?.message || "Failed to adjust balance."),
  });
}

export function useUpdateUserRole(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateUserRolePayload) => adminApi.patch(`/users/${id}`, payload).then((r) => r.data),
    onSuccess: () => {
      toast.success("Role updated.");
      invalidateUser(queryClient, id);
    },
    onError: (err: any) => toast.error(err?.response?.data?.message || "Failed to update role."),
  });
}


export function useAdminUsersList(params: QueryUsersParams = {}) {
  return useQuery({
    queryKey: ["admin", "users", params],
    queryFn: async () => {
      const { data } = await adminApi.get<PaginatedResponse<AdminUserListItem>>("/users", { params });
      return data;
    },
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      adminApi.delete(`/users/admin/${id}/delete`).then((r) => r.data),
    onSuccess: () => {
      toast.success("User deleted permanently.");
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "overview"] });
    },
    onError: (err: any) =>
      toast.error(err?.response?.data?.message || "Failed to delete user."),
  });
}