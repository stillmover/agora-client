import { z } from "zod";
export const registerSchema = z.object({
  email: z
    .string()
    .trim()
    .email("Please enter an email address.")
    .nonempty("Please fill in this field."),
  username: z
    .string()
    .min(3)
    .max(30)
    .regex(/^[a-zA-Z0-9_]+$/)
    .trim()
    .nonempty("Please fill in this field."),
  password: z
    .string()
    .trim()
    .nonempty("Please fill in this field.")
    .min(6, "Password must be at least 6 characters"),
});

export const loginSchema = z.object({
  usernameOrEmail: z.string().trim().nonempty("Please fill in this field."),
  password: z
    .string()
    .trim()
    .nonempty("Please fill in this field.")
    .min(6, "Password must be at least 6 characters"),
});

export const resetSchema = z.object({
  usernameOrEmail: z.string().trim().nonempty("Please fill in this field."),
});

export type LoginValues = z.infer<typeof loginSchema>;
export type RegisterValues = z.infer<typeof registerSchema>;
export type ResetValues = z.infer<typeof resetSchema>;
