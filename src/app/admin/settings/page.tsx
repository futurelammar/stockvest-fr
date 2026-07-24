"use client";

import { useState, useEffect } from "react";
import {
  Settings, Star, HelpCircle, ChevronDown, ChevronUp,
  Plus, Pencil, Trash2, Eye, EyeOff, Loader2, Check,
  X, ImageIcon, GripVertical,
} from "lucide-react";
import Image from "next/image";
import {
  useSettings, useUpsertSetting,
  useTestimonials, useCreateTestimonial, useUpdateTestimonial, useDeleteTestimonial,
  useFaqs, useCreateFaq, useUpdateFaq, useDeleteFaq,
} from "@/hooks/use-admin-content";
import type { Testimonial, TestimonialPayload, Faq, FaqPayload } from "@/hooks/use-admin-content";
import { ConfirmActionDialog } from "@/components/admin/confirm-action-dialog";

/* ─── helpers ────────────────────────────────────────────────────── */
function SkeletonBlock({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse rounded-lg bg-[#E5E0D4] ${className}`} />;
}

function SectionHeader({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#1F6F4F]/10 text-[#1F6F4F]">
        <Icon className="h-4 w-4" />
      </div>
      <div>
        <h2 className="font-display text-lg font-bold text-[#0E1A17]">{title}</h2>
        <p className="text-sm text-[#5B6661]">{description}</p>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────
   SETTINGS PANEL
───────────────────────────────────────────────────────────────── */
const SETTING_SCHEMAS: {
  key: string;
  label: string;
  fields: { name: string; label: string; placeholder: string; multiline?: boolean }[];
}[] = [
  {
    key: "homepage",
    label: "Homepage Content",
    fields: [
      { name: "heroTitle", label: "Hero title", placeholder: "Invest Smarter, Grow Faster" },
      { name: "heroSubtitle", label: "Hero subtitle", placeholder: "Stock investment plans built for real returns" },
      { name: "ctaText", label: "CTA button text", placeholder: "Start Investing" },
    ],
  },
  {
    key: "contact_info",
    label: "Contact Info",
    fields: [
      { name: "email", label: "Support email", placeholder: "support@yourplatform.com" },
      { name: "phone", label: "Phone number", placeholder: "+234 801 234 5678" },
      { name: "address", label: "Address", placeholder: "Kano, Nigeria", multiline: true },
    ],
  },
  {
    key: "site_meta",
    label: "Site Meta",
    fields: [
      { name: "siteName", label: "Platform name", placeholder: "Pitlane Markets" },
      { name: "tagline", label: "Tagline", placeholder: "Curated stock plans, funded in crypto" },
      { name: "disclaimer", label: "Legal disclaimer", placeholder: "Plans are platform-determined, not brokered.", multiline: true },
    ],
  },
];

function SettingPanel({ schema }: { schema: (typeof SETTING_SCHEMAS)[0] }) {
  const { data: allSettings, isLoading } = useSettings();
  const upsert = useUpsertSetting();

  const existing = allSettings?.find((s) => s.key === schema.key);
  const [form, setForm] = useState<Record<string, string>>({});
  const [dirty, setDirty] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (existing) {
      const init: Record<string, string> = {};
      schema.fields.forEach((f) => {
        init[f.name] = existing.value[f.name] ?? "";
      });
      setForm(init);
      setDirty(false);
    }
  }, [existing, schema]);

  function handleChange(name: string, value: string) {
    setForm((f) => ({ ...f, [name]: value }));
    setDirty(true);
  }

  function handleSave() {
    const value: Record<string, any> = {};
    schema.fields.forEach((f) => { if (form[f.name]) value[f.name] = form[f.name]; });
    upsert.mutate({ key: schema.key, value }, { onSuccess: () => setDirty(false) });
  }

  return (
    <div className="rounded-xl border border-[#E5E0D4] bg-white">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between px-5 py-4"
      >
        <div className="flex items-center gap-2">
          <span className="font-display text-base font-semibold text-[#0E1A17]">{schema.label}</span>
          {existing && (
            <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-[#1F6F4F]">
              Saved
            </span>
          )}
          {dirty && (
            <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-700">
              Unsaved changes
            </span>
          )}
        </div>
        {open ? <ChevronUp className="h-4 w-4 text-[#5B6661]" /> : <ChevronDown className="h-4 w-4 text-[#5B6661]" />}
      </button>

      {open && (
        <div className="border-t border-[#F1EDE2] px-5 pb-5 pt-4 space-y-4">
          {isLoading
            ? schema.fields.map((f) => <SkeletonBlock key={f.name} className="h-10 w-full" />)
            : schema.fields.map((f) => (
                <div key={f.name} className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wide text-[#5B6661]">
                    {f.label}
                  </label>
                  {f.multiline ? (
                    <textarea
                      rows={3}
                      value={form[f.name] ?? ""}
                      onChange={(e) => handleChange(f.name, e.target.value)}
                      placeholder={f.placeholder}
                      className="w-full resize-none rounded-lg border border-[#D6D0C4] bg-white p-3 text-sm text-[#0E1A17] outline-none focus:border-[#1F6F4F]"
                    />
                  ) : (
                    <input
                      value={form[f.name] ?? ""}
                      onChange={(e) => handleChange(f.name, e.target.value)}
                      placeholder={f.placeholder}
                      className="w-full rounded-lg border border-[#D6D0C4] bg-white px-3 py-2.5 text-sm text-[#0E1A17] outline-none focus:border-[#1F6F4F]"
                    />
                  )}
                </div>
              ))}

          <div className="flex justify-end">
            <button
              onClick={handleSave}
              disabled={!dirty || upsert.isPending}
              className="flex items-center gap-2 rounded-lg bg-[#1F6F4F] px-4 py-2 text-sm font-semibold text-white hover:bg-[#186040] disabled:opacity-50"
            >
              {upsert.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Check className="h-4 w-4" />
              )}
              {upsert.isPending ? "Saving…" : "Save changes"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────
   TESTIMONIAL FORM
───────────────────────────────────────────────────────────────── */
function TestimonialForm({
  initial,
  onSubmit,
  onCancel,
  loading,
}: {
  initial?: Testimonial | null;
  onSubmit: (payload: TestimonialPayload) => void;
  onCancel: () => void;
  loading: boolean;
}) {
  const [name, setName] = useState(initial?.name ?? "");
  const [role, setRole] = useState(initial?.role ?? "");
  const [message, setMessage] = useState(initial?.message ?? "");
  const [rating, setRating] = useState(initial?.rating ?? 5);
  const [isActive, setIsActive] = useState(initial?.isActive ?? true);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(initial?.photo ?? null);

  const canSubmit = name.trim() && message.trim();

  return (
    <div className="rounded-xl border border-[#D6D0C4] bg-[#FAFAF7] p-4 space-y-3">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wide text-[#5B6661]">Name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Jane Doe"
            className="w-full rounded-lg border border-[#D6D0C4] bg-white px-3 py-2 text-sm text-[#0E1A17] outline-none focus:border-[#1F6F4F]"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wide text-[#5B6661]">
            Role <span className="font-normal normal-case text-[#B0AAA0]">(optional)</span>
          </label>
          <input
            value={role}
            onChange={(e) => setRole(e.target.value)}
            placeholder="Investor"
            className="w-full rounded-lg border border-[#D6D0C4] bg-white px-3 py-2 text-sm text-[#0E1A17] outline-none focus:border-[#1F6F4F]"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-semibold uppercase tracking-wide text-[#5B6661]">Message</label>
        <textarea
          rows={3}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="This platform changed how I invest. Highly recommend!"
          className="w-full resize-none rounded-lg border border-[#D6D0C4] bg-white p-3 text-sm text-[#0E1A17] outline-none focus:border-[#1F6F4F]"
        />
      </div>

      <div className="flex flex-wrap items-center gap-4">
        {/* Rating */}
        <div className="space-y-1">
          <label className="text-xs font-semibold uppercase tracking-wide text-[#5B6661]">Rating</label>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setRating(n)}
                className={`text-lg transition-transform hover:scale-110 ${
                  n <= rating ? "text-[#C9A24B]" : "text-[#D6D0C4]"
                }`}
              >
                ★
              </button>
            ))}
          </div>
        </div>

        {/* Photo upload */}
        <div className="space-y-1">
          <label className="text-xs font-semibold uppercase tracking-wide text-[#5B6661]">Photo</label>
          {photoPreview ? (
            <div className="relative flex items-center gap-2">
              <Image
                src={photoPreview}
                alt="Preview"
                width={32}
                height={32}
                className="h-8 w-8 rounded-full border object-cover"
                unoptimized={!photoPreview.includes("cloudinary")}
              />
              <button
                type="button"
                onClick={() => { setPhotoFile(null); setPhotoPreview(initial?.photo ?? null); }}
                className="text-[#5B6661] hover:text-[#A8392F]"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ) : (
            <label className="flex cursor-pointer items-center gap-1.5 rounded-lg border border-[#D6D0C4] bg-white px-2.5 py-1.5 text-xs text-[#5B6661] hover:border-[#1F6F4F]">
              <ImageIcon className="h-3.5 w-3.5" />
              Upload
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setPhotoFile(file);
                    setPhotoPreview(URL.createObjectURL(file));
                  }
                }}
              />
            </label>
          )}
        </div>

        {/* Active toggle */}
        <div className="ml-auto flex items-center gap-2">
          <span className="text-xs text-[#5B6661]">Active</span>
          <button
            type="button"
            onClick={() => setIsActive((v) => !v)}
            className={`relative h-5 w-9 rounded-full transition-colors ${
              isActive ? "bg-[#1F6F4F]" : "bg-[#D6D0C4]"
            }`}
          >
            <span
              className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${
                isActive ? "translate-x-4" : "translate-x-0.5"
              }`}
            />
          </button>
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-1">
        <button
          onClick={onCancel}
          className="rounded-lg px-3 py-1.5 text-xs font-medium text-[#5B6661] hover:bg-[#F7F4EE]"
        >
          Cancel
        </button>
        <button
          onClick={() =>
            onSubmit({
              name: name.trim(),
              role: role.trim() || undefined,
              message: message.trim(),
              rating,
              isActive,
              photo: photoFile ?? undefined,
            })
          }
          disabled={!canSubmit || loading}
          className="flex items-center gap-1.5 rounded-lg bg-[#1F6F4F] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#186040] disabled:opacity-50"
        >
          {loading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
          {initial ? "Save" : "Add testimonial"}
        </button>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────
   FAQ FORM
───────────────────────────────────────────────────────────────── */
function FaqForm({
  initial,
  totalFaqs,
  onSubmit,
  onCancel,
  loading,
}: {
  initial?: Faq | null;
  totalFaqs: number;
  onSubmit: (payload: FaqPayload) => void;
  onCancel: () => void;
  loading: boolean;
}) {
  const [question, setQuestion] = useState(initial?.question ?? "");
  const [answer, setAnswer] = useState(initial?.answer ?? "");
  const [order, setOrder] = useState(initial?.order ?? totalFaqs + 1);
  const [isActive, setIsActive] = useState(initial?.isActive ?? true);

  const canSubmit = question.trim() && answer.trim();

  return (
    <div className="rounded-xl border border-[#D6D0C4] bg-[#FAFAF7] p-4 space-y-3">
      <div className="space-y-1.5">
        <label className="text-xs font-semibold uppercase tracking-wide text-[#5B6661]">Question</label>
        <input
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="How long does it take to verify my account?"
          className="w-full rounded-lg border border-[#D6D0C4] bg-white px-3 py-2 text-sm text-[#0E1A17] outline-none focus:border-[#1F6F4F]"
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-semibold uppercase tracking-wide text-[#5B6661]">Answer</label>
        <textarea
          rows={3}
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="Verification is instant once you click the link in your email."
          className="w-full resize-none rounded-lg border border-[#D6D0C4] bg-white p-3 text-sm text-[#0E1A17] outline-none focus:border-[#1F6F4F]"
        />
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wide text-[#5B6661]">
            Display order
          </label>
          <input
            type="number"
            min="1"
            value={order}
            onChange={(e) => setOrder(Number(e.target.value))}
            className="w-20 rounded-lg border border-[#D6D0C4] bg-white px-3 py-2 text-sm text-[#0E1A17] outline-none focus:border-[#1F6F4F]"
          />
        </div>

        <div className="ml-auto flex items-center gap-2">
          <span className="text-xs text-[#5B6661]">Active</span>
          <button
            type="button"
            onClick={() => setIsActive((v) => !v)}
            className={`relative h-5 w-9 rounded-full transition-colors ${
              isActive ? "bg-[#1F6F4F]" : "bg-[#D6D0C4]"
            }`}
          >
            <span
              className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${
                isActive ? "translate-x-4" : "translate-x-0.5"
              }`}
            />
          </button>
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-1">
        <button
          onClick={onCancel}
          className="rounded-lg px-3 py-1.5 text-xs font-medium text-[#5B6661] hover:bg-[#F7F4EE]"
        >
          Cancel
        </button>
        <button
          onClick={() =>
            onSubmit({
              question: question.trim(),
              answer: answer.trim(),
              order,
              isActive,
            })
          }
          disabled={!canSubmit || loading}
          className="flex items-center gap-1.5 rounded-lg bg-[#1F6F4F] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#186040] disabled:opacity-50"
        >
          {loading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
          {initial ? "Save" : "Add FAQ"}
        </button>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────────────────────────────── */
export default function AdminSettingsPage() {
  const { data: testimonials, isLoading: testimonialsLoading } = useTestimonials();
  const { data: faqs, isLoading: faqsLoading } = useFaqs();

  const createTestimonial = useCreateTestimonial();
  const deleteTestimonial = useDeleteTestimonial();

  const createFaq = useCreateFaq();
  const deleteFaq = useDeleteFaq();

  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
  const [addingTestimonial, setAddingTestimonial] = useState(false);
  const [deletingTestimonial, setDeletingTestimonial] = useState<Testimonial | null>(null);

  const updateTestimonialMutation = useUpdateTestimonial(editingTestimonial?._id ?? "");

  const [editingFaq, setEditingFaq] = useState<Faq | null>(null);
  const [addingFaq, setAddingFaq] = useState(false);
  const [deletingFaq, setDeletingFaq] = useState<Faq | null>(null);

  const [updateFaqId, setUpdateFaqId] = useState("");
  const updateFaqMutation = useUpdateFaq(updateFaqId);

  return (
    <div className="space-y-10">
      <div>
        <h1 className="font-display text-2xl font-bold text-[#0E1A17]">Site Content</h1>
        <p className="mt-0.5 text-sm text-[#5B6661]">
          Edit public-facing text, testimonials, and FAQs — no code changes needed.
        </p>
      </div>

      {/* ── Settings ── */}
      <section className="space-y-4">
        <SectionHeader
          icon={Settings}
          title="Site Settings"
          description="Control homepage copy, contact info, and meta text."
        />
        <div className="space-y-3">
          {SETTING_SCHEMAS.map((schema) => (
            <SettingPanel key={schema.key} schema={schema} />
          ))}
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="space-y-4">
        <div className="flex items-start justify-between gap-4">
          <SectionHeader
            icon={Star}
            title="Testimonials"
            description="Customer reviews shown on the public homepage."
          />
          {!addingTestimonial && (
            <button
              onClick={() => { setAddingTestimonial(true); setEditingTestimonial(null); }}
              className="flex shrink-0 items-center gap-2 rounded-lg bg-[#1F6F4F] px-3.5 py-2 text-sm font-semibold text-white hover:bg-[#186040]"
            >
              <Plus className="h-4 w-4" /> Add
            </button>
          )}
        </div>

        {addingTestimonial && (
          <TestimonialForm
            onSubmit={(payload) =>
              createTestimonial.mutate(payload, {
                onSuccess: () => setAddingTestimonial(false),
              })
            }
            onCancel={() => setAddingTestimonial(false)}
            loading={createTestimonial.isPending}
          />
        )}

        {testimonialsLoading && (
          <div className="space-y-3">
            {Array.from({ length: 2 }).map((_, i) => (
              <SkeletonBlock key={i} className="h-24 w-full" />
            ))}
          </div>
        )}

        {!testimonialsLoading && testimonials?.length === 0 && !addingTestimonial && (
          <div className="rounded-xl border border-dashed border-[#D6D0C4] bg-white py-10 text-center">
            <p className="text-sm text-[#5B6661]">No testimonials yet. Add one above.</p>
          </div>
        )}

        <div className="space-y-3">
          {testimonials?.map((t) =>
            editingTestimonial?._id === t._id ? (
              <TestimonialForm
                key={t._id}
                initial={t}
                onSubmit={(payload) =>
                  updateTestimonialMutation.mutate(payload, {
                    onSuccess: () => setEditingTestimonial(null),
                  })
                }
                onCancel={() => setEditingTestimonial(null)}
                loading={updateTestimonialMutation.isPending}
              />
            ) : (
              <div
                key={t._id}
                className={`flex items-start gap-4 rounded-xl border border-[#E5E0D4] bg-white p-4 ${
                  !t.isActive ? "opacity-55" : ""
                }`}
              >
                {t.photo ? (
                  <Image
                    src={t.photo}
                    alt={t.name}
                    width={40}
                    height={40}
                    className="h-10 w-10 shrink-0 rounded-full border border-[#E5E0D4] object-cover"
                  />
                ) : (
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#0E1A17] text-sm font-bold text-emerald-400">
                    {t.name.slice(0, 1)}
                  </div>
                )}

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-semibold text-[#0E1A17]">{t.name}</p>
                    {t.role && <p className="text-xs text-[#5B6661]">· {t.role}</p>}
                    <span className="text-[#C9A24B]">{"★".repeat(t.rating)}</span>
                    {!t.isActive && (
                      <span className="rounded-full bg-[#F7F4EE] px-2 py-0.5 text-[10px] font-bold text-[#5B6661]">
                        Hidden
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-sm text-[#5B6661]">{t.message}</p>
                </div>

                <div className="flex shrink-0 items-center gap-1">
                  <button
                    onClick={() => {
                      setEditingTestimonial(t);
                      setAddingTestimonial(false);
                    }}
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#D6D0C4] text-[#5B6661] hover:border-[#1F6F4F] hover:text-[#1F6F4F]"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => setDeletingTestimonial(t)}
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#A8392F]/30 bg-rose-50 text-[#A8392F] hover:bg-rose-100"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ),
          )}
        </div>
      </section>

      {/* ── FAQs ── */}
      <section className="space-y-4">
        <div className="flex items-start justify-between gap-4">
          <SectionHeader
            icon={HelpCircle}
            title="FAQs"
            description="Questions shown on the public FAQ page, ordered by the display order number."
          />
          {!addingFaq && (
            <button
              onClick={() => { setAddingFaq(true); setEditingFaq(null); }}
              className="flex shrink-0 items-center gap-2 rounded-lg bg-[#1F6F4F] px-3.5 py-2 text-sm font-semibold text-white hover:bg-[#186040]"
            >
              <Plus className="h-4 w-4" /> Add
            </button>
          )}
        </div>

        {addingFaq && (
          <FaqForm
            totalFaqs={faqs?.length ?? 0}
            onSubmit={(payload) =>
              createFaq.mutate(payload, {
                onSuccess: () => setAddingFaq(false),
              })
            }
            onCancel={() => setAddingFaq(false)}
            loading={createFaq.isPending}
          />
        )}

        {faqsLoading && (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <SkeletonBlock key={i} className="h-16 w-full" />
            ))}
          </div>
        )}

        {!faqsLoading && faqs?.length === 0 && !addingFaq && (
          <div className="rounded-xl border border-dashed border-[#D6D0C4] bg-white py-10 text-center">
            <p className="text-sm text-[#5B6661]">No FAQs yet. Add one above.</p>
          </div>
        )}

        <div className="space-y-2">
          {faqs
            ?.slice()
            .sort((a, b) => a.order - b.order)
            .map((faq) =>
              editingFaq?._id === faq._id ? (
                <FaqForm
                  key={faq._id}
                  initial={faq}
                  totalFaqs={faqs.length}
                  onSubmit={(payload) =>
                    updateFaqMutation.mutate(payload, {
                      onSuccess: () => setEditingFaq(null),
                    })
                  }
                  onCancel={() => setEditingFaq(null)}
                  loading={updateFaqMutation.isPending}
                />
              ) : (
                <div
                  key={faq._id}
                  className={`rounded-xl border border-[#E5E0D4] bg-white ${
                    !faq.isActive ? "opacity-55" : ""
                  }`}
                >
                  <div className="flex items-start gap-3 p-4">
                    <GripVertical className="mt-0.5 h-4 w-4 shrink-0 text-[#D6D0C4]" />
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-semibold text-sm text-[#0E1A17]">{faq.question}</p>
                        <span className="rounded-full bg-[#F7F4EE] px-1.5 py-0.5 font-mono text-[10px] text-[#5B6661]">
                          #{faq.order}
                        </span>
                        {!faq.isActive && (
                          <span className="flex items-center gap-1 rounded-full bg-[#F7F4EE] px-2 py-0.5 text-[10px] font-bold text-[#5B6661]">
                            <EyeOff className="h-2.5 w-2.5" /> Hidden
                          </span>
                        )}
                      </div>
                      <p className="mt-1 text-sm text-[#5B6661]">{faq.answer}</p>
                    </div>
                    <div className="flex shrink-0 items-center gap-1">
                      <button
                        onClick={() => {
                          setEditingFaq(faq);
                          setUpdateFaqId(faq._id);
                          setAddingFaq(false);
                        }}
                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#D6D0C4] text-[#5B6661] hover:border-[#1F6F4F] hover:text-[#1F6F4F]"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => setDeletingFaq(faq)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#A8392F]/30 bg-rose-50 text-[#A8392F] hover:bg-rose-100"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ),
            )}
        </div>
      </section>

      {/* ── Confirm dialogs ── */}
      <ConfirmActionDialog
        open={!!deletingTestimonial}
        onClose={() => setDeletingTestimonial(null)}
        onConfirm={() => {
          if (deletingTestimonial) {
            deleteTestimonial.mutate(deletingTestimonial._id, {
              onSuccess: () => setDeletingTestimonial(null),
            });
          }
        }}
        title="Delete testimonial?"
        description={`"${deletingTestimonial?.name}" will be permanently removed.`}
        confirmLabel="Delete"
        tone="danger"
        loading={deleteTestimonial.isPending}
      />

      <ConfirmActionDialog
        open={!!deletingFaq}
        onClose={() => setDeletingFaq(null)}
        onConfirm={() => {
          if (deletingFaq) {
            deleteFaq.mutate(deletingFaq._id, {
              onSuccess: () => setDeletingFaq(null),
            });
          }
        }}
        title="Delete FAQ?"
        description={`"${deletingFaq?.question.slice(0, 60)}…" will be permanently removed.`}
        confirmLabel="Delete"
        tone="danger"
        loading={deleteFaq.isPending}
      />
    </div>
  );
}