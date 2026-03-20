import { PrismaClient } from '@generated/prisma/client';
import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaMssql } from '@prisma/adapter-mssql';
import { DefaultArgs } from '@prisma/client/runtime/client';
import sql from 'mssql';
import { ConfigService } from './ConfigService/Config.service';

/**
 * NestJS-aware Prisma client service.
 *
 * Extends `PrismaClient` (so all Prisma model methods are available directly)
 * and adds NestJS lifecycle hooks so the database connection is opened when the
 * module initialises and cleanly closed when the app shuts down.
 *
 * **MSSQL adapter:** Uses `@prisma/adapter-mssql` which reads the SQL Server
 * connection details from `ConfigService`. The pool configuration and timeout
 * values are pulled from environment variables so they can be tuned per
 * environment without code changes.
 *
 * **Query logging:** In `development`, all queries, info, warnings, and errors
 * are logged to the console. In other environments only warnings and errors
 * are logged to reduce noise.
 *
 * @example
 * // Inject and use in a command/query handler
 * constructor(private readonly prisma: PrismaService) {}
 * const user = await this.prisma.customer.findUnique({ where: { Customer_ID: 1 } });
 */
@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor(readonly configService: ConfigService) {
    const config: sql.config = {
      server: configService.get('DB_HOST'),
      port: configService.get('DB_PORT'),
      database: configService.get('DB_NAME'),
      user: configService.get('DB_USER'),
      password: configService.get('DB_PASSWORD'),
      connectionTimeout: configService.get('DB_TIMEOUT'),
      requestTimeout: configService.get('DB_TIMEOUT'),
      pool: {
        min: configService.get('DB_POOL_MIN_CONNECTIONS'),
        max: configService.get('DB_POOL_MAX_CONNECTIONS'),
        idleTimeoutMillis: configService.get('DB_TIMEOUT'),
      },
      options: {
        encrypt: configService.get('DB_ENCRYPT'),
        trustedConnection: configService.get('DB_TRUST_CONNECTION'),
        trustServerCertificate: configService.get(
          'DB_TRUST_SERVER_CERTIFICATE',
        ),
      },
    };
    const adapter = new PrismaMssql(config);
    super({
      adapter,
      log:
        configService.get('NODE_ENV') === 'development'
          ? ['query', 'info', 'warn', 'error']
          : ['warn', 'error'],
    });
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }

  async onModuleInit() {
    await this.$connect();
  }
}

/**
 * Type alias for the Prisma transaction client passed to `$transaction` callbacks.
 *
 * When running operations inside `prisma.$transaction(async (tx) => { ... })`,
 * the `tx` argument has the same model methods as `PrismaClient` but without the
 * connection-management methods (`$connect`, `$disconnect`, etc.) since those
 * are managed by the transaction itself.
 *
 * Use this type in private helpers that need to participate in a transaction:
 * @example
 * private async clearCart(tx: TX, cartId: number): Promise<void> {
 *   await tx.shopping_Cart.delete({ where: { Cart_ID: cartId } });
 * }
 */
export type TX = Omit<
  PrismaClient<never, undefined, DefaultArgs>,
  '$connect' | '$disconnect' | '$on' | '$use' | '$extends'
>;
