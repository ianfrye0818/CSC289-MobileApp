import { Inject, Injectable } from '@nestjs/common';
import dotenv from 'dotenv';
import { AppConfig, configSchema } from './Config.schema';

/**
 * Injection token used to provide the Zod schema to `ConfigService`.
 * Keeps the module/service decoupled — the module passes the schema in via DI
 * rather than `ConfigService` importing it directly.
 */
export const CONFIG_TOKEN = 'CONFIG_TOKEN';

dotenv.config();

/**
 * Type-safe configuration service for server environment variables.
 *
 * Reads from `process.env` (or an optional `.env` file path) and validates
 * the values against the Zod schema injected via `CONFIG_TOKEN`. If validation
 * fails the server refuses to start.
 *
 * Inject this service wherever you need an env variable instead of accessing
 * `process.env` directly — you get full TypeScript type inference on the return
 * value and a runtime error with a helpful message if the key is missing.
 *
 * @example
 * constructor(private readonly config: ConfigService) {}
 *
 * const secret = this.config.get('JWT_SECRET'); // type: string
 * const port   = this.config.get('PORT');        // type: number
 */
@Injectable()
export class ConfigService {
  private validatedEnv: AppConfig;
  private schema: typeof configSchema;

  constructor(
    @Inject(CONFIG_TOKEN) schema: typeof configSchema,
    envFile?: string,
  ) {
    this.schema = schema;
    const env = envFile ? dotenv.config({ path: envFile }).parsed : process.env;
    this.validatedEnv = this.schema.parse(env);
  }

  /**
   * Returns the validated value for the given environment variable key.
   * Throws if the key is missing or failed Zod validation during construction.
   *
   * @param key - A key from `AppConfig` (auto-completed by TypeScript).
   */
  get<K extends keyof AppConfig>(key: K): AppConfig[K] {
    const value = this.validatedEnv[key];
    if (value === undefined) {
      throw new Error(
        `Environment variable '${String(key)}' not found or failed validation`,
      );
    }
    return value;
  }

  /** Returns all validated environment variables as a single object. */
  getAll(): AppConfig {
    return this.validatedEnv;
  }

  /**
   * Returns `true` if the given key is present and non-undefined in the
   * validated env. Useful for optional feature flags.
   */
  has<K extends keyof AppConfig>(key: K): boolean {
    return this.validatedEnv[key] !== undefined;
  }
}
