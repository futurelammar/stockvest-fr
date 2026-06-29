import { z } from "zod";

export const registerSchema = z.object({
  fullName: z.string().min(2, "Enter your full name"),
  email: z.string().email("Enter a valid email address"),
  password: z
    .string()
    .min(8, "Use at least 8 characters")
    .regex(/[A-Z]/, "Include at least one uppercase letter")
    .regex(/[0-9]/, "Include at least one number"),
  phone: z.string().optional(),
});
export type RegisterFormValues = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(1, "Enter your password"),
});
export type LoginFormValues = z.infer<typeof loginSchema>;