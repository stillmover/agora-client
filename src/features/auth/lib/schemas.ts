import { z } from "zod";

const USERNAME_MIN_LENGTH = 3;
const USERNAME_MAX_LENGTH = 30;
const PASSWORD_MIN_LENGTH = 6;

const registerSchema = z.object({
  email: z
    .string()
    .trim()
    .email("Please enter an email address.")
    .nonempty("Please fill in this field."),
  username: z
    .string()
    .min(USERNAME_MIN_LENGTH)
    .max(USERNAME_MAX_LENGTH)
    .regex(/^[a-zA-Z0-9_]+$/)
    .trim()
    .nonempty("Please fill in this field."),
  password: z
    .string()
    .trim()
    .nonempty("Please fill in this field.")
    .min(PASSWORD_MIN_LENGTH, "Password must be at least 6 characters"),
});

const loginSchema = z.object({
  usernameOrEmail: z.string().trim().nonempty("Please fill in this field."),
  password: z
    .string()
    .trim()
    .nonempty("Please fill in this field.")
    .min(PASSWORD_MIN_LENGTH, "Password must be at least 6 characters"),
});

const resetSchema = z.object({
  usernameOrEmail: z.string().trim().nonempty("Please fill in this field."),
});

type LoginValues = z.infer<typeof loginSchema>;
type RegisterValues = z.infer<typeof registerSchema>;
type ResetValues = z.infer<typeof resetSchema>;

export { registerSchema, loginSchema, resetSchema };
export type { LoginValues, RegisterValues, ResetValues };
