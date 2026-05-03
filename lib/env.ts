import z from 'zod';

/**
 * Zod schema that declares every environment variable the app requires.
 *
 * Add new variables here as the project grows. Zod will validate their
 * presence and types at startup — if a required variable is missing the app
 * will throw immediately with a clear error rather than failing silently later.
 *
 * Variables prefixed with `EXPO_PUBLIC_` are bundled into the client build by
 * Expo and are safe to use in the mobile app. Never put secrets in the mobile
 * app; those belong in the server's `.env` only.
 */
const envSchema = z.object({
  EXPO_PUBLIC_API_URL: z.string(),
});

/**
 * Validated, type-safe environment variables.
 *
 * Import `env` anywhere you need an environment variable instead of accessing
 * `process.env` directly — this guarantees the value exists and is the correct
 * type.
 *
 * @example
 * import { env } from '@/lib/env';
 * console.log(env.EXPO_PUBLIC_API_URL);
 */
export const env = envSchema.parse({
  EXPO_PUBLIC_API_URL: process.env.EXPO_PUBLIC_API_URL,
});
