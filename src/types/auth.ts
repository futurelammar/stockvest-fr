export interface AuthUser {
  id: string;
  fullName: string;
  email: string;
  role: "user" | "admin";
  balance?: number;
  isEmailVerified?: boolean;
}

export interface AdminUser extends Omit<AuthUser, "role"> {
  role: "admin";
}

export function isAdminUser(user: AuthUser): user is AdminUser {
  return user.role === "admin";
}

export interface LoginResponse {
  user: AuthUser;
}

export interface RegisterResponse {
  message: string;
  email: string;
}