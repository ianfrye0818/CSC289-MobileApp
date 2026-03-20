import {
  ConsoleLogger,
  ConsoleLoggerOptions,
  Injectable,
  Scope,
} from '@nestjs/common';

/**
 * Application-wide logger service.
 *
 * Extends NestJS's built-in `ConsoleLogger` with timestamps enabled by default.
 * Scoped as `TRANSIENT` so each consumer gets its own instance, which means
 * the `context` string (e.g. the class name) is correctly set per caller.
 *
 * Inject this wherever you need structured log output instead of using
 * `console.log` directly:
 *
 * @example
 * constructor(private readonly logger: AppLogger) {
 *   this.logger = new AppLogger(MyService.name);
 * }
 * this.logger.log('Processing order 42');
 * this.logger.error('Something went wrong', stack);
 */
@Injectable({ scope: Scope.TRANSIENT })
export class AppLogger extends ConsoleLogger {
  constructor(context: string, options?: Partial<ConsoleLoggerOptions>) {
    super(context, { timestamp: true, ...options });
  }
}
