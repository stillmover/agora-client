import { z } from "zod";

const envSchema = z.object({
  APP_NAME: z.string().default("Reddit Client"),
  APP_VERSION: z.string().default("1.0.0"),
  APP_ENV: z.enum(["development", "production", "test"]).default("development"),

  HOST: z.string().default("localhost"),
  PORT: z.coerce.number().int().positive().default(5173),
  PREVIEW_PORT: z.coerce.number().int().positive().default(4173),

  BACKEND_URL: z.string().url().default("http://localhost:5555"),
  API_BASE_URL: z.string().url().default("https://www.reddit.com/api/v1"),
  API_TIMEOUT: z.coerce.number().int().positive().default(10000),

  REDDIT_CLIENT_ID: z.string().min(1, "REDDIT_CLIENT_ID is required"),
  REDDIT_CLIENT_SECRET: z.string().min(1, "REDDIT_CLIENT_SECRET is required"),
  REDDIT_USER_AGENT: z.string().default("RedditClient/1.0.0"),
  REDDIT_REDIRECT_URI: z
    .string()
    .url()
    .default("http://localhost:5173/auth/callback"),

  ENABLE_ANALYTICS: z.coerce.boolean().default(false),
  ENABLE_ERROR_REPORTING: z.coerce.boolean().default(true),
  ENABLE_DEBUG_MODE: z.coerce.boolean().default(true),

  SENTRY_DSN: z.string().optional(),
  GA_TRACKING_ID: z.string().optional(),
  HOTJAR_ID: z.string().optional(),
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
        { cause: error },
      );
    }

    throw new Error(`Environment parsing failed: ${error}`, { cause: error });
  }
}

export const env = parseEnv();

export const isDevelopment = env.APP_ENV === "development";
export const isProduction = env.APP_ENV === "production";
export const isTest = env.APP_ENV === "test";
