

export type UserRole   = 'user' | 'admin';
export type UserStatus = 'active' | 'suspended' | 'pending';
export type KycStatus  = 'unverified' | 'pending' | 'verified' | 'rejected';

export interface User {
  _id: string;
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  profilePhoto?: string;
  role: UserRole;
  status: UserStatus;
  kycStatus: KycStatus;
  balance: number;
  totalInvested: number;
  totalProfit: number;
  isEmailVerified: boolean;
  isActive: boolean;
  emailNotifications: boolean;
  createdAt: string;
  updatedAt: string;
}

// ─── DTOs ─────────────────────────────────────────────────────────

export interface UpdateProfileDto {
  fullName?: string;
  phone?: string;
}

export interface ChangePasswordDto {
  currentPassword: string;
  newPassword: string;
}

// ─── Admin DTOs ───────────────────────────────────────────────────

export interface AdminUpdateUserDto {
  status?: UserStatus;
  kycStatus?: KycStatus;
  isActive?: boolean;
}

export interface QueryUsersDto {
  page?: number;
  limit?: number;
  search?: string;
  status?: UserStatus;
  role?: UserRole;
}

export interface UserListResponse {
  data: User[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}