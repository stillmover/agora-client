import { z } from "zod";

const USERNAME_MIN_LENGTH = 3;
const USERNAME_MAX_LENGTH = 30;
const PASSWORD_MIN_LENGTH = 8;

const registerSchema = z.object({
  email: z
    .string()
    .trim()
    .nonempty("Please enter your email address.")
    .email("Please enter a valid email address."),
  password: z
    .string()
    .trim()
    .nonempty("Please enter a password.")
    .min(PASSWORD_MIN_LENGTH, `Password must be at least ${PASSWORD_MIN_LENGTH} characters.`),
  username: z
    .string()
    .trim()
    .nonempty("Please enter a username.")
    .min(USERNAME_MIN_LENGTH, `Username must be at least ${USERNAME_MIN_LENGTH} characters.`)
    .max(USERNAME_MAX_LENGTH, `Username must be at most ${USERNAME_MAX_LENGTH} characters.`)
    .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores."),
});

const loginSchema = z.object({
  password: z
    .string()
    .trim()
    .nonempty("Please enter your password.")
    .min(PASSWORD_MIN_LENGTH, `Password must be at least ${PASSWORD_MIN_LENGTH} characters.`),
  usernameOrEmail: z.string().trim().nonempty("Please enter your email or username."),
});

const resetSchema = z.object({
  usernameOrEmail: z.string().trim().nonempty("Please enter your email or username."),
});

type LoginValues = z.infer<typeof loginSchema>;
type RegisterValues = z.infer<typeof registerSchema>;
type ResetValues = z.infer<typeof resetSchema>;

export { registerSchema, loginSchema, resetSchema };
export type { LoginValues, RegisterValues, ResetValues };
