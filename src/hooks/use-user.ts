import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { api } from "@/lib/api";
import { useAuth } from '@/lib/auth-context';
import {
  User,
  UpdateProfileDto,
  ChangePasswordDto,
  AdminUpdateUserDto,
  QueryUsersDto,
  UserListResponse,
} from '@/types/user';

// ─── Query keys ───────────────────────────────────────────────────
export const userKeys = {
  me:       ['user', 'me'] as const,
  adminAll: (params?: QueryUsersDto) => ['users', 'admin', params] as const,
  adminOne: (id: string) => ['users', 'admin', id] as const,
};

// ─── API calls ────────────────────────────────────────────────────
const usersApi = {
  getMe:          () => api.get<User>('/users/me'),
  updateMe:       (dto: UpdateProfileDto) => api.patch<User>('/users/me', dto),
  changePassword: (dto: ChangePasswordDto) => api.patch('/users/me/password', dto),
  uploadPhoto:    (file: File) => {
    const form = new FormData();
    form.append('photo', file);
    return api.patch<{ profilePhoto: string }>('/users/me/photo', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  // Admin
  getAll:      (params?: QueryUsersDto) => api.get<UserListResponse>('/users', { params }),
  getById:     (id: string) => api.get<User>(`/users/${id}`),
  updateUser:  (id: string, dto: AdminUpdateUserDto) => api.patch<User>(`/users/${id}`, dto),
  deleteUser:  (id: string) => api.delete(`/users/${id}`),
};

// ─── Current user ─────────────────────────────────────────────────

/** Fetch the authenticated user's full profile from the server */
export function useCurrentUser() {
  return useQuery({
    queryKey: userKeys.me,
    queryFn:  () => usersApi.getMe().then(r => r.data),
    staleTime: 60_000,
  });
}

// ─── Profile update ───────────────────────────────────────────────

/** Update fullName / phone */
export function useUpdateProfile() {
  const qc           = useQueryClient();
  const { refreshUser } = useAuth();

  return useMutation({
    mutationFn: (dto: UpdateProfileDto) => usersApi.updateMe(dto).then(r => r.data),
    onSuccess: (updated) => {
      // Keep server cache fresh
      qc.setQueryData(userKeys.me, updated);
      // Keep auth cookie in sync so topbar balance / name stays correct
      refreshUser(updated as any);
      toast.success('Profile updated successfully.');
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message ?? 'Failed to update profile.');
    },
  });
}

// ─── Photo upload ─────────────────────────────────────────────────

/** Upload a new profile photo to Cloudinary via the backend */
export function useUploadPhoto() {
  const qc           = useQueryClient();
  const { refreshUser } = useAuth();

  return useMutation({
    mutationFn: (file: File) => usersApi.uploadPhoto(file).then(r => r.data),
    onSuccess: (data) => {
      // Patch just the photo field in the cached user
      qc.setQueryData<User>(userKeys.me, (prev) =>
        prev ? { ...prev, profilePhoto: data.profilePhoto } : prev,
      );
      refreshUser({ ...({} as any), profilePhoto: data.profilePhoto });
      toast.success('Photo updated.');
    },
    onError: () => {
      toast.error('Photo upload failed. Please try again.');
    },
  });
}

// ─── Password change ──────────────────────────────────────────────

/** Change password — requires current password */
export function useChangePassword() {
  return useMutation({
    mutationFn: (dto: ChangePasswordDto) =>
      usersApi.changePassword(dto).then(r => r.data),
    onSuccess: () => {
      toast.success('Password changed successfully.');
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message ?? 'Password change failed.');
    },
  });
}

// ─── Admin hooks ──────────────────────────────────────────────────

/** Admin: paginated user list with optional search/filter */
export function useAdminUsers(params?: QueryUsersDto) {
  return useQuery({
    queryKey: userKeys.adminAll(params),
    queryFn:  () => usersApi.getAll(params).then(r => r.data),
  });
}

/** Admin: single user by ID */
export function useAdminUser(id: string) {
  return useQuery({
    queryKey: userKeys.adminOne(id),
    queryFn:  () => usersApi.getById(id).then(r => r.data),
    enabled:  !!id,
  });
}

/** Admin: update user status / KYC */
export function useAdminUpdateUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: AdminUpdateUserDto }) =>
      usersApi.updateUser(id, dto).then(r => r.data),
    onSuccess: (updated, { id }) => {
      qc.setQueryData(userKeys.adminOne(id), updated);
      qc.invalidateQueries({ queryKey: ['users', 'admin'] });
      toast.success('User updated.');
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message ?? 'Update failed.');
    },
  });
}

/** Admin: soft-delete (deactivate) a user */
export function useAdminDeleteUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => usersApi.deleteUser(id),
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: ['users', 'admin'] });
      qc.removeQueries({ queryKey: userKeys.adminOne(id) });
      toast.success('User deactivated.');
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message ?? 'Action failed.');
    },
  });
}