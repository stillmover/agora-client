import { z } from "zod";

const envSchema = z.object({
  APP_ENV: z.enum(["development", "production", "test"]).default("development"),
  BACKEND_URL: z.string().url().default("http://localhost:8000"),
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_REDIRECT_URI: z.string().url().optional(),
  SENTRY_DSN: z.string().optional(),
  HOST: z.string().default("localhost"),
  PORT: z.coerce.number().int().positive().default(5173),
  PREVIEW_PORT: z.coerce.number().int().positive().default(4173),
});

export type EnvConfig = z.infer<typeof envSchema>;

function parseEnv(): EnvConfig {
  try {
    const envObject: Record<string, string | undefined> = {};

    Object.keys(import.meta.env).forEach((key) => {
      if (key.startsWith("VITE_")) {
        const cleanKey = key.replace("VITE_", "");
        envObject[cleanKey] = import.meta.env[key];
      }
    });

    return envSchema.parse(envObject);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessages = error.issues
        .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
        .join("\n");

      throw new Error(
        `Environment validation failed:\n${errorMessages}\n\n` +
          "Please check your .env.local file and ensure all required variables are set correctly.",
        { cause: error }
      );
    }

    throw new Error(`Environment parsing failed: ${error}`, { cause: error });
  }
}

export const env = parseEnv();

export const isDevelopment = env.APP_ENV === "development";
export const isProduction = env.APP_ENV === "production";
export const isTest = env.APP_ENV === "test";
export const sentryDsn = env.SENTRY_DSN;
