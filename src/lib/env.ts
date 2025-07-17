import { z } from "zod";

// Define the schema for environment variables
const envSchema = z.object({
  // Node environment
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),

  // Public environment variables (accessible in browser)
  NEXT_PUBLIC_APP_URL: z.string().url().default("http://localhost:3000"),
  NEXT_PUBLIC_ENABLE_ANALYTICS: z
    .string()
    .default("false")
    .transform((val) => val === "true"),
  NEXT_PUBLIC_ENABLE_DARK_MODE: z
    .string()
    .default("true")
    .transform((val) => val === "true"),
  NEXT_PUBLIC_ENABLE_NOTIFICATIONS: z
    .string()
    .default("true")
    .transform((val) => val === "true"),

  // Optional server-side environment variables
  DATABASE_URL: z.string().optional(),
  NEXTAUTH_SECRET: z.string().optional(),
  NEXTAUTH_URL: z.string().url().optional(),

  // API Keys (optional for development)
  OPENAI_API_KEY: z.string().optional(),
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),

  // Analytics (optional)
  GOOGLE_ANALYTICS_ID: z.string().optional(),
  VERCEL_ANALYTICS_ID: z.string().optional(),

  // Bundle analyzer
  ANALYZE: z
    .string()
    .default("false")
    .transform((val) => val === "true"),
});

// Validate and parse environment variables
function validateEnv() {
  try {
    return envSchema.parse(process.env);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const missingVars = error.issues
        .map((issue) => issue.path.join("."))
        .join(", ");
      throw new Error(`Invalid environment variables: ${missingVars}`);
    }
    throw error;
  }
}

// Export validated environment variables
export const env = validateEnv();

// Type for environment variables
export type Env = z.infer<typeof envSchema>;

// Helper functions
export const isDevelopment = env.NODE_ENV === "development";
export const isProduction = env.NODE_ENV === "production";
export const isTest = env.NODE_ENV === "test";

// Feature flags
export const features = {
  analytics: env.NEXT_PUBLIC_ENABLE_ANALYTICS,
  darkMode: env.NEXT_PUBLIC_ENABLE_DARK_MODE,
  notifications: env.NEXT_PUBLIC_ENABLE_NOTIFICATIONS,
} as const;

// Utility to check if required environment variables are set for production
export function checkProductionEnv() {
  if (isProduction) {
    const requiredVars = ["DATABASE_URL", "NEXTAUTH_SECRET", "NEXTAUTH_URL"];

    const missingVars = requiredVars.filter((varName) => !process.env[varName]);

    if (missingVars.length > 0) {
      throw new Error(
        `Missing required environment variables for production: ${missingVars.join(", ")}`
      );
    }
  }
}
