export interface AdminUserDetail {
  _id: string;
  fullName: string;
  email: string;
  phone?: string;
  role: "user" | "admin";
  balance: number;
  totalInvested: number;
  totalProfit: number;
  isActive: boolean;
  blockedReason?: string;
  blockedAt?: string;
  withdrawalsBlocked: boolean;
  withdrawalsBlockedReason?: string;
  isEmailVerified: boolean;
  profilePhoto?: string;
  createdAt: string;
}

export interface AdjustBalancePayload {
  amount: number;
  reason: string;
}

export interface BlockPayload {
  reason?: string;
}

export interface UpdateUserRolePayload {
  role: "user" | "admin";
}

export interface AdminUserListItem {
  _id: string;
  fullName: string;
  email: string;
  phone?: string;
  role: "user" | "admin";
  balance: number;
  isActive: boolean;
  withdrawalsBlocked: boolean;
  isEmailVerified: boolean;
  createdAt: string;
}

export interface QueryUsersParams {
  page?: number;
  limit?: number;
  search?: string;
  role?: "user" | "admin";
  isActive?: boolean;
}