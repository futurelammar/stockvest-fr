
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { api } from "@/lib/api";
import {
  Withdrawal,
  WithdrawalListResponse,
  CreateWithdrawalDto,
  ReviewWithdrawalDto,
  QueryWithdrawalsDto,
} from '../types/withdrawal';

// ─── Query keys ───────────────────────────────────────────────────
export const withdrawalKeys = {
  all:       ['withdrawals'] as const,
  mine:      (params?: QueryWithdrawalsDto) => ['withdrawals', 'mine', params] as const,
  myOne:     (id: string)  => ['withdrawals', 'mine', id] as const,
  adminAll:  (params?: QueryWithdrawalsDto) => ['withdrawals', 'admin', params] as const,
  adminOne:  (id: string)  => ['withdrawals', 'admin', id] as const,
};

// ─── API calls ────────────────────────────────────────────────────
const withdrawalsApi = {
  create:    (dto: CreateWithdrawalDto) =>
    api.post<Withdrawal>('/withdrawals', dto),

  getMine:   (params?: QueryWithdrawalsDto) =>
    api.get<WithdrawalListResponse>('/withdrawals/me', { params }),

  getMyOne:  (id: string) =>
    api.get<Withdrawal>(`/withdrawals/me/${id}`),

  // Admin
  getAll:    (params?: QueryWithdrawalsDto) =>
    api.get<WithdrawalListResponse>('/withdrawals/admin/all', { params }),

  getOne:    (id: string) =>
    api.get<Withdrawal>(`/withdrawals/admin/${id}`),

  approve:   (id: string) =>
    api.patch<Withdrawal>(`/withdrawals/admin/${id}/approve`),

  reject:    (id: string, dto: ReviewWithdrawalDto) =>
    api.patch<Withdrawal>(`/withdrawals/admin/${id}/reject`, dto),

  markPaid:  (id: string) =>
    api.patch<Withdrawal>(`/withdrawals/admin/${id}/mark-paid`),
};

// ─── User hooks ───────────────────────────────────────────────────

/** My withdrawal list with optional filters */
export function useMyWithdrawals(params?: QueryWithdrawalsDto) {
  return useQuery({
    queryKey: withdrawalKeys.mine(params),
    queryFn:  () => withdrawalsApi.getMine(params).then(r => r.data),
  });
}

/** Single withdrawal (user-owned) */
export function useMyWithdrawal(id: string) {
  return useQuery({
    queryKey: withdrawalKeys.myOne(id),
    queryFn:  () => withdrawalsApi.getMyOne(id).then(r => r.data),
    enabled:  !!id,
  });
}

/** Submit a new withdrawal request */
export function useCreateWithdrawal() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (dto: CreateWithdrawalDto) =>
      withdrawalsApi.create(dto).then(r => r.data),
    onSuccess: () => {
      toast.success('Withdrawal request submitted successfully.');
      qc.invalidateQueries({ queryKey: withdrawalKeys.all });
      // Also refresh user balance (reflected in /users/me)
      qc.invalidateQueries({ queryKey: ['user', 'me'] });
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message ?? 'Withdrawal request failed.');
    },
  });
}

// ─── Admin hooks ──────────────────────────────────────────────────

/** Admin: paginated withdrawal list with optional filters */
export function useAdminWithdrawals(params?: QueryWithdrawalsDto) {
  return useQuery({
    queryKey: withdrawalKeys.adminAll(params),
    queryFn:  () => withdrawalsApi.getAll(params).then(r => r.data),
  });
}

/** Admin: single withdrawal detail */
export function useAdminWithdrawal(id: string) {
  return useQuery({
    queryKey: withdrawalKeys.adminOne(id),
    queryFn:  () => withdrawalsApi.getOne(id).then(r => r.data),
    enabled:  !!id,
  });
}

/** Admin: approve a pending withdrawal */
export function useApproveWithdrawal() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => withdrawalsApi.approve(id).then(r => r.data),
    onSuccess: (_, id) => {
      toast.success('Withdrawal approved.');
      qc.invalidateQueries({ queryKey: withdrawalKeys.all });
      qc.invalidateQueries({ queryKey: withdrawalKeys.adminOne(id) });
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message ?? 'Approval failed.');
    },
  });
}

/** Admin: reject a pending withdrawal (balance is automatically refunded by backend) */
export function useRejectWithdrawal() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: ReviewWithdrawalDto }) =>
      withdrawalsApi.reject(id, dto).then(r => r.data),
    onSuccess: (_, { id }) => {
      toast.success('Withdrawal rejected. Balance refunded to user.');
      qc.invalidateQueries({ queryKey: withdrawalKeys.all });
      qc.invalidateQueries({ queryKey: withdrawalKeys.adminOne(id) });
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message ?? 'Rejection failed.');
    },
  });
}

/** Admin: mark an approved withdrawal as paid */
export function useMarkWithdrawalPaid() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => withdrawalsApi.markPaid(id).then(r => r.data),
    onSuccess: (_, id) => {
      toast.success('Withdrawal marked as paid.');
      qc.invalidateQueries({ queryKey: withdrawalKeys.all });
      qc.invalidateQueries({ queryKey: withdrawalKeys.adminOne(id) });
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message ?? 'Failed to mark as paid.');
    },
  });
}