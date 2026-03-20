import { DynamicModule, Global } from '@nestjs/common';
import { configSchema } from './Config.schema';
import { CONFIG_TOKEN, ConfigService } from './Config.service';

/**
 * Global dynamic module that wires `ConfigService` into the DI container.
 *
 * Marking the module `@Global()` means you only need to import it once in
 * `AppModule` — every other module can inject `ConfigService` directly without
 * importing `CustomConfigModule` again.
 *
 * Usage in `AppModule`:
 * ```ts
 * CustomConfigModule.forRoot({ schema: configSchema })
 * ```
 *
 * The `schema` parameter lets you swap the Zod schema in tests or if the
 * project grows to need separate schemas for different environments.
 */
@Global()
export class CustomConfigModule {
  /**
   * Registers `ConfigService` with the provided Zod schema.
   *
   * @param options.schema - The Zod schema used to validate `process.env`.
   * @param options.envFile - Optional path to a custom `.env` file (useful in tests).
   */
  static async forRoot(options: {
    schema: typeof configSchema;
    envFile?: string;
  }): Promise<DynamicModule> {
    return {
      module: CustomConfigModule,
      providers: [
        {
          provide: CONFIG_TOKEN,
          useValue: options.schema,
        },
        {
          provide: ConfigService,
          useFactory: (schema: typeof configSchema) =>
            new ConfigService(schema, options.envFile),
          inject: [CONFIG_TOKEN],
        },
      ],
      exports: [ConfigService],
    };
  }
}
