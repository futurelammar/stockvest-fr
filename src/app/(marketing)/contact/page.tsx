"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, Clock, ShieldCheck, CheckCircle2, Loader2, ArrowRight } from "lucide-react";

type FormState = { name: string; email: string; subject: string; message: string };

const SUBJECTS = ["Account & verification", "Deposits & withdrawals", "Investment plans", "Something else"];

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <label className="mb-2 block text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
      {children}
    </label>
  );
}

const inputClass =
  "w-full rounded-lg border border-input bg-background px-3.5 py-3 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-ring";

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
    <div className="min-h-screen bg-background text-foreground">
      {/* ── Header band ── */}
      <section className="border-b border-border px-4 pb-10 pt-14 sm:px-6 sm:pt-20 lg:pt-24">
        <div className="mx-auto max-w-5xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            <span className="text-[11px] font-bold uppercase tracking-wider text-primary">
              Support online — reply under 24h
            </span>
          </div>

          <h1 className="font-display max-w-xl text-3xl font-bold leading-tight tracking-tight sm:text-5xl">
            Get in touch
          </h1>
          <p className="mt-4 max-w-md text-base leading-relaxed text-muted-foreground">
            Questions about a deposit, a plan, or your account — a real person on our team reads every message.
          </p>
        </div>
      </section>

      {/* ── Body ── */}
      <section className="px-4 py-12 sm:px-6 sm:py-16">
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 lg:grid-cols-[1.3fr_1fr]">
          {/* ── Form ── */}
          <div className="rounded-xl border border-border bg-card p-6 sm:p-8">
            {status === "sent" ? (
              <div className="flex flex-col items-center py-10 text-center">
                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-primary/15">
                  <CheckCircle2 className="h-7 w-7 text-primary" />
                </div>
                <h2 className="font-display text-xl font-bold text-card-foreground">Message sent</h2>
                <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
                  We've got it. Expect a reply at{" "}
                  <span className="font-medium text-card-foreground">{form.email}</span> within a day.
                </p>
                <button
                  onClick={() => {
                    setForm({ name: "", email: "", subject: SUBJECTS[0], message: "" });
                    setStatus("idle");
                  }}
                  className="mt-6 text-sm font-semibold text-primary hover:underline"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="mb-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div>
                    <FieldLabel>Name</FieldLabel>
                    <input
                      className={inputClass}
                      value={form.name}
                      onChange={(e) => update("name", e.target.value)}
                      placeholder="Jordan Reyes"
                    />
                  </div>
                  <div>
                    <FieldLabel>Email</FieldLabel>
                    <input
                      type="email"
                      className={inputClass}
                      value={form.email}
                      onChange={(e) => update("email", e.target.value)}
                      placeholder="you@example.com"
                    />
                  </div>
                </div>

                <div className="mb-5">
                  <FieldLabel>What's this about</FieldLabel>
                  <div className="flex flex-wrap gap-2">
                    {SUBJECTS.map((s) => {
                      const active = form.subject === s;
                      return (
                        <button
                          type="button"
                          key={s}
                          onClick={() => update("subject", s)}
                          className={`rounded-full border px-3.5 py-2 text-xs font-semibold transition-colors ${
                            active
                              ? "border-primary bg-primary/10 text-foreground"
                              : "border-border bg-secondary text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          {s}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="mb-5">
                  <FieldLabel>Message</FieldLabel>
                  <textarea
                    className={`${inputClass} min-h-[140px] resize-y`}
                    value={form.message}
                    onChange={(e) => update("message", e.target.value)}
                    placeholder="Tell us what's going on…"
                  />
                </div>

                {error && <p className="mb-4 text-sm text-destructive">{error}</p>}

                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="inline-flex items-center gap-2 rounded-lg bg-primary px-7 py-3 text-sm font-bold uppercase tracking-wide text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
                >
                  {status === "sending" ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" /> Sending…
                    </>
                  ) : (
                    <>
                      Send message <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

          {/* ── Side info ── */}
          <div className="flex flex-col gap-4">
            {[
              { icon: Mail, title: "Email us directly", body: "support@autobull.example" },
              {
                icon: Clock,
                title: "Response time",
                body: "Under 24 hours, every day — deposits and withdrawals are reviewed by a human, not a bot.",
              },
              {
                icon: ShieldCheck,
                title: "Account & security",
                body: "For anything involving your balance or login, include the email on your account so we can verify you faster.",
              },
            ].map((item) => (
              <div key={item.title} className="rounded-xl border border-border bg-card p-5">
                <div className="mb-3.5 flex h-9 w-9 items-center justify-center rounded-lg bg-muted">
                  <item.icon className="h-4 w-4 text-accent" />
                </div>
                <h3 className="font-display text-sm font-bold text-card-foreground">{item.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{item.body}</p>
              </div>
            ))}

            <Link
              href="/faq"
              className="flex items-center justify-between rounded-xl border border-primary/25 bg-primary/5 px-5 py-4 no-underline"
            >
              <span className="text-sm font-semibold text-foreground">Check the FAQ first — quick answers</span>
              <ArrowRight className="h-4 w-4 shrink-0 text-primary" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}