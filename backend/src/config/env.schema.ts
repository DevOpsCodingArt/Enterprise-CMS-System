import { z } from 'zod';

export const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  PORT: z.coerce.number().default(4000),
  API_PREFIX: z.string().default('/api/v1'),
  FRONTEND_URL: z.string().default('http://localhost:3000'),

  // Database
  DB_HOST: z.string().default('localhost'),
  DB_PORT: z.coerce.number().default(5433),
  DB_USER: z.string().default('primeone_user'),
  DB_PASSWORD: z.string().default('securepassword123'),
  DB_NAME: z.string().default('primeone'),
  DATABASE_URL: z
    .string()
    .min(1, 'DATABASE_URL is required for database connectivity'),

  // Redis
  REDIS_HOST: z.string().default('localhost'),
  REDIS_PORT: z.coerce.number().default(6379),
  REDIS_PASSWORD: z.string().optional(),
  REDIS_URL: z.string().optional(),

  // JWT Cryptographic Secrets (Mandatory 32+ characters)
  JWT_ACCESS_SECRET: z
    .string()
    .min(32, 'JWT_ACCESS_SECRET must have at least 32 characters of entropy'),
  JWT_REFRESH_SECRET: z
    .string()
    .min(32, 'JWT_REFRESH_SECRET must have at least 32 characters of entropy'),
  JWT_ACCESS_EXPIRATION: z.string().default('15m'),
  JWT_REFRESH_EXPIRATION: z.string().default('7d'),

  // Storage & External Services (Optional in Dev)
  UPLOAD_DIR: z.string().default('./uploads'),
  R2_ACCOUNT_ID: z.string().optional(),
  R2_ACCESS_KEY_ID: z.string().optional(),
  R2_SECRET_ACCESS_KEY: z.string().optional(),
  R2_BUCKET_NAME: z.string().default('primeone-media'),
  R2_PUBLIC_DEV_URL: z.string().optional(),
});

export type EnvConfig = z.infer<typeof envSchema>;

/**
 * Validates environment variables at application startup.
 * Throws a formatted error if required variables are missing or insecure.
 */
export function validateEnv(config: Record<string, unknown>): EnvConfig {
  const result = envSchema.safeParse(config);

  if (!result.success) {
    const errorDetails = result.error.issues
      .map((err) => `  - [${err.path.join('.')}]: ${err.message}`)
      .join('\n');

    throw new Error(
      `\n❌ [ENV VALIDATION ERROR] Invalid environment configuration:\n${errorDetails}\n` +
        `Please check your backend/.env file.\n`,
    );
  }

  return result.data;
}
