import z from 'zod';

/**
 * Zod schema for all server environment variables.
 *
 * Every variable that the app needs must be declared here. `ConfigService`
 * parses `process.env` against this schema at startup — missing or incorrectly
 * typed variables throw immediately with a clear validation error instead of
 * causing cryptic runtime failures later.
 *
 * **String → boolean coercions:**
 * `DB_TRUST_SERVER_CERTIFICATE`, `DB_ENCRYPT`, and `DB_TRUST_CONNECTION` are
 * stored as strings in `.env` (`'true'`/`'false'`). The `.transform()` call
 * converts them to actual booleans before they reach the rest of the app.
 *
 * See `.env.example` for the full list of required variables and example values.
 */
export const configSchema = z.object({
  // GENERAL
  NODE_ENV: z.enum(['development', 'production', 'test']),
  PORT: z.coerce.number(),
  API_URL: z.string().optional().default('http://localhost:3000'),
  JWT_SECRET: z.string(),

  // DATABASE
  DATABASE_URL: z.string(),
  DB_HOST: z.string(),
  DB_PORT: z.coerce.number(),
  DB_NAME: z.string(),
  DB_USER: z.string(),
  DB_PASSWORD: z.string(),
  DB_TIMEOUT: z.coerce.number(),
  DB_POOL_MIN_CONNECTIONS: z.coerce.number(),
  DB_POOL_MAX_CONNECTIONS: z.coerce.number(),
  DB_TRUST_SERVER_CERTIFICATE: z.string().transform((val) => val === 'true'),
  DB_ENCRYPT: z.string().transform((val) => val === 'true'),
  DB_TRUST_CONNECTION: z.string().transform((val) => val === 'true'),

  REDIS_HOST: z.string().optional().default('localhost'),
  REDIS_PORT: z.coerce.number().optional().default(6379),

  WEBHOOK_API_KEY: z
    .string()
    .optional()
    .default('4C679E7B-B25F-431C-9E6D-06517D2D891A'),
});

/** Type-safe representation of all validated environment variables. */
export type AppConfig = z.infer<typeof configSchema>;
