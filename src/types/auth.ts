export interface AuthUser {
  id: string;
  fullName: string;
  email: string;
  role: "user" | "admin";
  balance?: number;
  isEmailVerified?: boolean;
}

export interface LoginResponse {
  user: AuthUser;
}

export interface RegisterResponse {
  message: string;
  email: string;
}