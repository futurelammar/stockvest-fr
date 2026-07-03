"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { adminApi } from "@/lib/admin-api";

/* ─── Settings (key-value) ─────────────────────────────────────── */

export interface Setting {
  _id: string;
  key: string;
  value: Record<string, any>;
  updatedAt: string;
}

export function useSettings() {
  return useQuery({
    queryKey: ["admin", "settings"],
    queryFn: async () => {
      const { data } = await adminApi.get<Setting[]>("/settings");
      return data;
    },
  });
}

export function useUpsertSetting() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ key, value }: { key: string; value: Record<string, any> }) =>
      adminApi.put<Setting>(`/settings/${key}`, { value }).then((r) => r.data),
    onSuccess: (_, { key }) => {
      toast.success(`"${key}" setting saved.`);
      queryClient.invalidateQueries({ queryKey: ["admin", "settings"] });
    },
    onError: (err: any) =>
      toast.error(err?.response?.data?.message || "Failed to save setting."),
  });
}

/* ─── Testimonials ──────────────────────────────────────────────── */

export interface Testimonial {
  _id: string;
  name: string;
  role?: string;
  photo?: string;
  message: string;
  rating: number;
  isActive: boolean;
  createdAt: string;
}

export interface TestimonialPayload {
  name: string;
  role?: string;
  message: string;
  rating?: number;
  isActive?: boolean;
  photo?: File;
}

function buildTestimonialFormData(payload: TestimonialPayload) {
  const fd = new FormData();
  fd.append("name", payload.name);
  if (payload.role) fd.append("role", payload.role);
  fd.append("message", payload.message);
  if (payload.rating !== undefined) fd.append("rating", String(payload.rating));
  if (payload.isActive !== undefined) fd.append("isActive", String(payload.isActive));
  if (payload.photo) fd.append("photo", payload.photo);
  return fd;
}

export function useTestimonials() {
  return useQuery({
    queryKey: ["admin", "testimonials"],
    queryFn: async () => {
      const { data } = await adminApi.get<Testimonial[]>("/testimonials/admin/all");
      return data;
    },
  });
}

export function useCreateTestimonial() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: TestimonialPayload) =>
      adminApi
        .post<Testimonial>("/testimonials", buildTestimonialFormData(payload), {
          headers: { "Content-Type": "multipart/form-data" },
        })
        .then((r) => r.data),
    onSuccess: () => {
      toast.success("Testimonial added.");
      queryClient.invalidateQueries({ queryKey: ["admin", "testimonials"] });
      queryClient.invalidateQueries({ queryKey: ["testimonials"] });
    },
    onError: (err: any) =>
      toast.error(err?.response?.data?.message || "Failed to add testimonial."),
  });
}

export function useUpdateTestimonial(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Partial<TestimonialPayload>) =>
      adminApi
        .patch<Testimonial>(`/testimonials/${id}`, buildTestimonialFormData(payload as TestimonialPayload), {
          headers: { "Content-Type": "multipart/form-data" },
        })
        .then((r) => r.data),
    onSuccess: () => {
      toast.success("Testimonial updated.");
      queryClient.invalidateQueries({ queryKey: ["admin", "testimonials"] });
      queryClient.invalidateQueries({ queryKey: ["testimonials"] });
    },
    onError: (err: any) =>
      toast.error(err?.response?.data?.message || "Failed to update testimonial."),
  });
}

export function useDeleteTestimonial() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminApi.delete(`/testimonials/${id}`).then((r) => r.data),
    onSuccess: () => {
      toast.success("Testimonial deleted.");
      queryClient.invalidateQueries({ queryKey: ["admin", "testimonials"] });
      queryClient.invalidateQueries({ queryKey: ["testimonials"] });
    },
    onError: (err: any) =>
      toast.error(err?.response?.data?.message || "Failed to delete testimonial."),
  });
}

/* ─── FAQs ──────────────────────────────────────────────────────── */

export interface Faq {
  _id: string;
  question: string;
  answer: string;
  order: number;
  isActive: boolean;
  createdAt: string;
}

export interface FaqPayload {
  question: string;
  answer: string;
  order?: number;
  isActive?: boolean;
}

export function useFaqs() {
  return useQuery({
    queryKey: ["admin", "faqs"],
    queryFn: async () => {
      const { data } = await adminApi.get<Faq[]>("/faqs/admin/all");
      return data;
    },
  });
}

export function useCreateFaq() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: FaqPayload) =>
      adminApi.post<Faq>("/faqs", payload).then((r) => r.data),
    onSuccess: () => {
      toast.success("FAQ added.");
      queryClient.invalidateQueries({ queryKey: ["admin", "faqs"] });
      queryClient.invalidateQueries({ queryKey: ["faqs"] });
    },
    onError: (err: any) =>
      toast.error(err?.response?.data?.message || "Failed to add FAQ."),
  });
}

export function useUpdateFaq(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Partial<FaqPayload>) =>
      adminApi.patch<Faq>(`/faqs/${id}`, payload).then((r) => r.data),
    onSuccess: () => {
      toast.success("FAQ updated.");
      queryClient.invalidateQueries({ queryKey: ["admin", "faqs"] });
      queryClient.invalidateQueries({ queryKey: ["faqs"] });
    },
    onError: (err: any) =>
      toast.error(err?.response?.data?.message || "Failed to update FAQ."),
  });
}

export function useDeleteFaq() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminApi.delete(`/faqs/${id}`).then((r) => r.data),
    onSuccess: () => {
      toast.success("FAQ deleted.");
      queryClient.invalidateQueries({ queryKey: ["admin", "faqs"] });
      queryClient.invalidateQueries({ queryKey: ["faqs"] });
    },
    onError: (err: any) =>
      toast.error(err?.response?.data?.message || "Failed to delete FAQ."),
  });
}