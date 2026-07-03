import axios from "axios";
import Cookies from "js-cookie";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api/v1";

// ─── Cookie key (different from the user cookie so sessions don't clash) ─────
const ADMIN_TOKEN_KEY = "admin_token";

export const saveAdminToken = (token: string) =>
  Cookies.set(ADMIN_TOKEN_KEY, token, {
    expires: 1,          // 1 day
    sameSite: "strict",
    // secure: true,     // uncomment in production (requires HTTPS)
  });

export const getAdminToken = () => Cookies.get(ADMIN_TOKEN_KEY) ?? null;

export const clearAdminToken = () => Cookies.remove(ADMIN_TOKEN_KEY);

// ─── Axios instance ────────────────────────────────────────────────────────
export const adminApi = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

adminApi.interceptors.request.use((config) => {
  const token = getAdminToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

adminApi.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      clearAdminToken();
      if (typeof window !== "undefined") {
        window.location.href = "/admin/login";
      }
    }
    return Promise.reject(error);
  }
);