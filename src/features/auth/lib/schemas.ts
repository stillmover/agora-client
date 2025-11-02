import { z } from "zod";

export const loginSchema = z.object({
  username: z.string().trim().nonempty("Please fill in this field."),
  password: z
    .string()
    .trim()
    .nonempty("Please fill in this field.")
    .min(6, "Password must be at least 6 characters"),
});

export const registerSchema = z.object({
  email: z
    .string()
    .email("Please enter an email address.")
    .nonempty("Please fill in this field."),
});

export const resetSchema = z.object({
  username: z.string().trim().nonempty("Please fill in this field."),
});

export type LoginValues = z.infer<typeof loginSchema>;
export type RegisterValues = z.infer<typeof registerSchema>;
export type ResetValues = z.infer<typeof resetSchema>;
