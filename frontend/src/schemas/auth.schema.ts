import { z } from "zod";

export const loginFormSchema = z.object({
  identifier: z
    .string()
    .min(1, "Email, username, or customer ID is required")
    .max(255, "Identifier cannot exceed 255 characters")
    .trim(),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(128, "Password cannot exceed 128 characters"),
  rememberMe: z.boolean().optional(),
});

export type LoginFormValues = z.infer<typeof loginFormSchema>;
