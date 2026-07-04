"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, Clock, ShieldCheck, CheckCircle2, Loader2, ArrowRight } from "lucide-react";

const RED   = "#C0392B";
const GOLD  = "#F39C12";
const GREEN = "#27AE60";

type FormState = { name: string; email: string; subject: string; message: string };

const SUBJECTS = ["Account & verification", "Deposits & withdrawals", "Investment plans", "Something else"];

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <label
      style={{
        display: "block",
        fontSize: "11px",
        fontWeight: 700,
        letterSpacing: "0.1em",
        textTransform: "uppercase",
        color: "rgba(255,255,255,0.45)",
        marginBottom: "8px",
      }}
    >
      {children}
    </label>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  background: "#141414",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: "8px",
  padding: "12px 14px",
  fontSize: "14px",
  color: "#fff",
  outline: "none",
};

export default function ContactPage() {
  const [form, setForm] = useState<FormState>({ name: "", email: "", subject: SUBJECTS[0], message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
  const [error, setError] = useState<string | null>(null);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      setError("Fill in your name, email, and message before sending.");
      return;
    }

    setStatus("sending");
    try {
      // TODO: wire to a real endpoint, e.g.:
      // await api.post("/contact", form);
      await new Promise((r) => setTimeout(r, 700));
      setStatus("sent");
    } catch {
      setError("Couldn't send that. Please try again in a moment.");
      setStatus("idle");
    }
  }

  return (
    <div style={{ background: "#0D0D0D", minHeight: "100vh" }}>
      {/* ── Header band ── */}
      <section
        style={{
          background: "linear-gradient(160deg, #0D0D0D 0%, #1A0A08 60%, #0D0D0D 100%)",
          borderBottom: "1px solid rgba(192,57,43,0.2)",
          padding: "clamp(56px, 10vw, 88px) clamp(16px, 5vw, 24px) clamp(48px, 8vw, 64px)",
        }}
      >
        <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "6px 14px",
              borderRadius: "999px",
              background: "rgba(39,174,96,0.12)",
              border: "1px solid rgba(39,174,96,0.35)",
              marginBottom: "24px",
            }}
          >
            <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: GREEN, animation: "pulse 2s infinite" }} />
            <span style={{ fontSize: "11px", fontWeight: 700, color: GREEN, letterSpacing: "0.1em", textTransform: "uppercase" }}>
              Support Online — Avg. Reply Under 24h
            </span>
          </div>

          <h1
            style={{
              fontFamily: "var(--font-display, Rajdhani, sans-serif)",
              fontSize: "clamp(34px, 5vw, 56px)",
              fontWeight: 700,
              lineHeight: 1.1,
              color: "#fff",
              letterSpacing: "-0.01em",
              marginBottom: "16px",
              maxWidth: "640px",
            }}
          >
            Get in touch with <span style={{ color: RED }}>AutoBull</span>
          </h1>
          <p style={{ fontSize: "16px", lineHeight: 1.6, color: "rgba(255,255,255,0.5)", maxWidth: "540px" }}>
            Questions about a deposit, a plan, or your account — a real person on our team reads every message.
          </p>
        </div>
      </section>

      {/* ── Body ── */}
      <section style={{ padding: "clamp(48px, 8vw, 80px) clamp(16px, 5vw, 24px) 96px" }}>
        <div
          className="grid grid-cols-1 lg:grid-cols-[1.3fr_1fr]"
          style={{ maxWidth: "1280px", margin: "0 auto", gap: "clamp(32px, 5vw, 48px)" }}
        >
          {/* ── Form ── */}
          <div
            style={{
              background: "#111",
              border: "1px solid rgba(255,255,255,0.07)",
              borderRadius: "16px",
              padding: "clamp(24px, 4vw, 36px)",
            }}
          >
            {status === "sent" ? (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", padding: "40px 0" }}>
                <div
                  style={{
                    width: "56px",
                    height: "56px",
                    borderRadius: "50%",
                    background: "rgba(39,174,96,0.15)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: "20px",
                  }}
                >
                  <CheckCircle2 size={28} color={GREEN} />
                </div>
                <h2 style={{ fontFamily: "var(--font-display, sans-serif)", fontSize: "22px", fontWeight: 700, color: "#fff", marginBottom: "8px" }}>
                  Message sent
                </h2>
                <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.5)", maxWidth: "360px", lineHeight: 1.6 }}>
                  We've got it. Expect a reply at <span style={{ color: "#fff" }}>{form.email}</span> within a day.
                </p>
                <button
                  onClick={() => {
                    setForm({ name: "", email: "", subject: SUBJECTS[0], message: "" });
                    setStatus("idle");
                  }}
                  style={{
                    marginTop: "24px",
                    fontSize: "13px",
                    fontWeight: 600,
                    color: RED,
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 sm:grid-cols-2" style={{ gap: "20px", marginBottom: "20px" }}>
                  <div>
                    <FieldLabel>Name</FieldLabel>
                    <input
                      style={inputStyle}
                      value={form.name}
                      onChange={(e) => update("name", e.target.value)}
                      placeholder="Jordan Reyes"
                    />
                  </div>
                  <div>
                    <FieldLabel>Email</FieldLabel>
                    <input
                      type="email"
                      style={inputStyle}
                      value={form.email}
                      onChange={(e) => update("email", e.target.value)}
                      placeholder="you@example.com"
                    />
                  </div>
                </div>

                <div style={{ marginBottom: "20px" }}>
                  <FieldLabel>What's this about</FieldLabel>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                    {SUBJECTS.map((s) => (
                      <button
                        type="button"
                        key={s}
                        onClick={() => update("subject", s)}
                        style={{
                          padding: "8px 14px",
                          borderRadius: "999px",
                          fontSize: "12px",
                          fontWeight: 600,
                          border: `1px solid ${form.subject === s ? RED : "rgba(255,255,255,0.12)"}`,
                          background: form.subject === s ? "rgba(192,57,43,0.15)" : "transparent",
                          color: form.subject === s ? "#fff" : "rgba(255,255,255,0.55)",
                          cursor: "pointer",
                        }}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                <div style={{ marginBottom: "20px" }}>
                  <FieldLabel>Message</FieldLabel>
                  <textarea
                    style={{ ...inputStyle, minHeight: "140px", resize: "vertical", fontFamily: "inherit" }}
                    value={form.message}
                    onChange={(e) => update("message", e.target.value)}
                    placeholder="Tell us what's going on…"
                  />
                </div>

                {error && (
                  <p style={{ fontSize: "13px", color: "#F87171", marginBottom: "16px" }}>{error}</p>
                )}

                <button
                  type="submit"
                  disabled={status === "sending"}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "13px 28px",
                    borderRadius: "8px",
                    background: RED,
                    color: "#fff",
                    fontWeight: 700,
                    fontSize: "14px",
                    letterSpacing: "0.04em",
                    textTransform: "uppercase",
                    border: "none",
                    cursor: status === "sending" ? "default" : "pointer",
                    opacity: status === "sending" ? 0.7 : 1,
                    boxShadow: "0 0 24px rgba(192,57,43,0.35)",
                  }}
                >
                  {status === "sending" ? (
                    <>
                      <Loader2 size={16} className="animate-spin" /> Sending…
                    </>
                  ) : (
                    <>
                      Send message <ArrowRight size={16} />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

          {/* ── Side info ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {[
              {
                icon: Mail,
                title: "Email us directly",
                body: "support@autobull.example",
                color: RED,
              },
              {
                icon: Clock,
                title: "Response time",
                body: "Under 24 hours, every day — deposits and withdrawals are reviewed by a human, not a bot.",
                color: GOLD,
              },
              {
                icon: ShieldCheck,
                title: "Account & security",
                body: "For anything involving your balance or login, include the email on your account so we can verify you faster.",
                color: GREEN,
              },
            ].map((item) => (
              <div
                key={item.title}
                style={{
                  background: "#141414",
                  border: "1px solid rgba(255,255,255,0.06)",
                  borderRadius: "14px",
                  padding: "22px",
                }}
              >
                <div
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "8px",
                    background: "rgba(255,255,255,0.06)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: "14px",
                  }}
                >
                  <item.icon size={16} color={item.color} />
                </div>
                <h3 style={{ fontFamily: "var(--font-display, sans-serif)", fontSize: "15px", fontWeight: 700, color: "#fff", marginBottom: "6px" }}>
                  {item.title}
                </h3>
                <p style={{ fontSize: "13px", lineHeight: 1.6, color: "rgba(255,255,255,0.45)" }}>{item.body}</p>
              </div>
            ))}

            <Link
              href="/faq"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                background: "rgba(192,57,43,0.08)",
                border: "1px solid rgba(192,57,43,0.25)",
                borderRadius: "14px",
                padding: "18px 20px",
                textDecoration: "none",
              }}
            >
              <span style={{ fontSize: "13px", fontWeight: 600, color: "#fff" }}>
                Check the FAQ first — quick answers
              </span>
              <ArrowRight size={16} color={RED} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}