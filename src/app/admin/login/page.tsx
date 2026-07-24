"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Eye, EyeOff, Loader2, ShieldCheck, ArrowUpRight,
  TrendingUp, Lock, AlertCircle,
} from "lucide-react";
import { useAdminLogin } from "@/hooks/use-admin-auth";
import { getAdminToken } from "@/lib/admin-api";

const schema = z.object({
  email:    z.string().email("Enter a valid email address."),
  password: z.string().min(1, "Password is required."),
});
type FormValues = z.infer<typeof schema>;

export default function AdminLoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const login  = useAdminLogin();
  const router = useRouter();

  useEffect(() => {
    if (getAdminToken()) router.replace("/admin/dashboard");
  }, [router]);

  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#0E1A17" }}>

      {/* ── LEFT — branding panel ─────────────────────────────── */}
      <div
        className="hidden lg:flex"
        style={{
          width: "48%",
          flexShrink: 0,
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "48px 56px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Dot grid */}
        <div style={{
          position: "absolute", inset: 0, opacity: 0.035, pointerEvents: "none",
          backgroundImage: "radial-gradient(#34d399 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }} />

        {/* Glows */}
        <div style={{
          position: "absolute", top: "-6rem", left: "-6rem",
          width: "26rem", height: "26rem", borderRadius: "50%",
          background: "rgba(31,111,79,0.18)", filter: "blur(80px)", pointerEvents: "none",
        }} />
        <div style={{
          position: "absolute", bottom: "-4rem", right: "-3rem",
          width: "20rem", height: "20rem", borderRadius: "50%",
          background: "rgba(52,211,153,0.08)", filter: "blur(70px)", pointerEvents: "none",
        }} />

        {/* Logo */}
        <div style={{ position: "relative", zIndex: 1, display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{
            width: "32px", height: "32px", borderRadius: "8px", background: "#1F6F4F",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <TrendingUp size={16} style={{ color: "#C9A24B" }} />
          </div>
          <span style={{ fontFamily: "var(--font-display, serif)", fontSize: "20px", fontWeight: 700, color: "#fff" }}>
            Pitlane Markets<span style={{ color: "#34d399" }}>.</span>
          </span>
          <span style={{
            fontSize: "9px", fontWeight: 700, letterSpacing: "0.14em",
            textTransform: "uppercase", color: "rgba(255,255,255,0.28)",
          }}>Admin</span>
        </div>

        {/* Centre copy */}
        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "24px" }}>
            <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#34d399", display: "inline-block" }} />
            <span style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.13em", textTransform: "uppercase", color: "#34d399" }}>
              Admin control panel
            </span>
          </div>

          <h1 style={{
            fontFamily: "var(--font-display, serif)",
            fontSize: "clamp(28px, 3vw, 42px)",
            fontWeight: 700, lineHeight: 1.2, color: "#fff", margin: "0 0 20px",
          }}>
            Manage your platform
            <br />
            <span style={{ color: "#34d399" }}>from one place.</span>
          </h1>

          <p style={{ fontSize: "15px", lineHeight: 1.65, color: "rgba(255,255,255,0.42)", maxWidth: "300px", margin: 0 }}>
            Approve deposits, manage investment plans, review withdrawals,
            and oversee every user account — all in one dashboard.
          </p>

          {/* Feature list */}
          <div style={{ marginTop: "36px", display: "flex", flexDirection: "column", gap: "12px" }}>
            {[
              "Deposit and withdrawal approvals",
              "Investment plan management",
              "User account oversight",
              "Real-time platform stats",
            ].map(item => (
              <div key={item} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div style={{
                  width: "20px", height: "20px", borderRadius: "50%",
                  background: "rgba(52,211,153,0.15)", border: "1px solid rgba(52,211,153,0.3)",
                  display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                }}>
                  <ShieldCheck size={10} style={{ color: "#34d399" }} />
                </div>
                <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.55)" }}>{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div style={{
          position: "relative", zIndex: 1, display: "flex", alignItems: "center",
          justifyContent: "space-between", paddingTop: "24px",
          borderTop: "1px solid rgba(255,255,255,0.08)",
        }}>
          <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.22)" }}>
            © {new Date().getFullYear()} Pitlane Markets Capital. Admin access only.
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: "11px", color: "rgba(255,255,255,0.22)" }}>
            <Lock size={11} style={{ color: "#34d399" }} />
            Secured
          </div>
        </div>
      </div>

      {/* ── RIGHT — form panel ────────────────────────────────── */}
      <div style={{
        flex: 1, display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        padding: "48px 40px", background: "#F7F4EE", overflowY: "auto",
      }}>
        {/* Mobile logo */}
        <div className="lg:hidden" style={{ marginBottom: "32px", alignSelf: "flex-start" }}>
          <span style={{ fontFamily: "var(--font-display, serif)", fontSize: "20px", fontWeight: 700, color: "#0E1A17" }}>
            Pitlane Markets<span style={{ color: "#1F6F4F" }}>.</span>
          </span>
          <span style={{ marginLeft: "8px", fontSize: "10px", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#5B6661" }}>
            Admin
          </span>
        </div>

        <div style={{ width: "100%", maxWidth: "400px" }}>

          {/* Restricted badge */}
          <div style={{
            display: "flex", alignItems: "center", gap: "8px",
            marginBottom: "28px", padding: "9px 14px", borderRadius: "8px",
            border: "1px solid rgba(31,111,79,0.22)", background: "rgba(31,111,79,0.07)",
          }}>
            <ShieldCheck size={14} style={{ color: "#1F6F4F", flexShrink: 0 }} />
            <span style={{ fontSize: "12px", fontWeight: 500, color: "#1F6F4F" }}>
              Restricted to admin accounts only
            </span>
          </div>

          {/* Heading */}
          <div style={{ marginBottom: "28px" }}>
            <h2 style={{
              fontFamily: "var(--font-display, serif)",
              fontSize: "26px", fontWeight: 700, letterSpacing: "-0.4px",
              color: "#0E1A17", margin: "0 0 6px",
            }}>
              Admin sign in
            </h2>
            <p style={{ fontSize: "13px", color: "#5B6661", margin: 0 }}>
              Enter your credentials to access the control panel.
            </p>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit(vals => login.mutate(vals))}
            style={{ display: "flex", flexDirection: "column", gap: "16px" }}
          >
            {/* Email */}
            <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
              <label htmlFor="email" style={{ fontSize: "12px", fontWeight: 600, color: "#0E1A17" }}>
                Email address
              </label>
              <input
                id="email"
                type="email"
                placeholder="admin@example.com"
                autoComplete="email"
                {...register("email")}
                style={{
                  height: "42px", borderRadius: "10px",
                  border: errors.email ? "2px solid #A8392F" : "1.5px solid #D6D0C4",
                  background: "#fff", padding: "0 14px",
                  fontSize: "14px", color: "#0E1A17", outline: "none",
                  fontFamily: "inherit", transition: "border-color 0.15s",
                }}
                onFocus={e => { if (!errors.email) e.target.style.borderColor = "#1F6F4F"; }}
                onBlur={e  => { if (!errors.email) e.target.style.borderColor = "#D6D0C4"; }}
              />
              {errors.email && (
                <p style={{ fontSize: "11px", color: "#A8392F", margin: 0, display: "flex", alignItems: "center", gap: "4px" }}>
                  <AlertCircle size={10} /> {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
              <label htmlFor="password" style={{ fontSize: "12px", fontWeight: 600, color: "#0E1A17" }}>
                Password
              </label>
              <div style={{ position: "relative" }}>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  {...register("password")}
                  style={{
                    height: "42px", width: "100%", borderRadius: "10px",
                    border: errors.password ? "2px solid #A8392F" : "1.5px solid #D6D0C4",
                    background: "#fff", padding: "0 44px 0 14px",
                    fontSize: "14px", color: "#0E1A17", outline: "none",
                    fontFamily: "inherit", boxSizing: "border-box", transition: "border-color 0.15s",
                  }}
                  onFocus={e => { if (!errors.password) e.target.style.borderColor = "#1F6F4F"; }}
                  onBlur={e  => { if (!errors.password) e.target.style.borderColor = "#D6D0C4"; }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(v => !v)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  style={{
                    position: "absolute", right: "12px", top: "50%",
                    transform: "translateY(-50%)", background: "none",
                    border: "none", cursor: "pointer", color: "#B0AAA0",
                    display: "flex", alignItems: "center", padding: 0,
                  }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && (
                <p style={{ fontSize: "11px", color: "#A8392F", margin: 0, display: "flex", alignItems: "center", gap: "4px" }}>
                  <AlertCircle size={10} /> {errors.password.message}
                </p>
              )}
            </div>

            {/* API error */}
            {login.isError && (
              <div style={{
                borderRadius: "10px", border: "1px solid #fecdd3",
                background: "#fff1f2", padding: "12px 14px",
                fontSize: "13px", color: "#9f1239",
                display: "flex", alignItems: "flex-start", gap: "8px",
              }}>
                <AlertCircle size={14} style={{ flexShrink: 0, marginTop: "1px" }} />
                {(login.error as any)?.response?.data?.message ?? "Invalid credentials. Please try again."}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={login.isPending}
              style={{
                marginTop: "4px", height: "46px", width: "100%",
                borderRadius: "10px", background: "#1F6F4F",
                border: "none", cursor: login.isPending ? "not-allowed" : "pointer",
                fontSize: "14px", fontWeight: 700, color: "#fff",
                fontFamily: "inherit", display: "flex", alignItems: "center",
                justifyContent: "center", gap: "8px",
                boxShadow: "0 4px 14px rgba(31,111,79,0.28)",
                transition: "background 0.15s", opacity: login.isPending ? 0.75 : 1,
              }}
              onMouseEnter={e => { if (!login.isPending) (e.currentTarget as HTMLElement).style.background = "#196040"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "#1F6F4F"; }}
            >
              {login.isPending ? (
                <><Loader2 size={17} className="animate-spin" /> Signing in…</>
              ) : (
                <>Sign in to admin panel <ArrowUpRight size={17} /></>
              )}
            </button>
          </form>

          <p style={{ marginTop: "22px", textAlign: "center", fontSize: "12px", color: "#5B6661" }}>
            Not an admin?{" "}
            <a href="/login" style={{ color: "#1F6F4F", textDecoration: "none", fontWeight: 600 }}>
              Go to user login
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}