import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

/**
 * Global interceptor that converts `BigInt` values in response payloads to
 * strings before JSON serialisation.
 *
 * JavaScript's `JSON.stringify` throws a `TypeError` when it encounters a
 * `BigInt` value because the JSON spec has no BigInt type. Prisma returns some
 * ID columns (and potentially numeric columns) as `BigInt` — this interceptor
 * recursively walks the response object tree and converts any `BigInt` to its
 * string representation so the response serialises cleanly.
 *
 * Registered globally in `useGlobalInterceptors.ts`, so it applies to every
 * controller response automatically.
 */
@Injectable()
export class BigIntInterceptor implements NestInterceptor {
  intercept(_: ExecutionContext, next: CallHandler<any>): Observable<any> {
    return next.handle().pipe(map((data) => this.reserializeBigInt(data)));
  }

  /**
   * Recursively converts `BigInt` values to strings throughout an object tree.
   * Handles primitives, arrays, and plain objects.
   */
  private reserializeBigInt(obj: any): any {
    if (obj === null || obj === undefined) return obj;

    //Handle BigInts
    if (typeof obj === 'bigint') return obj.toString();

    //Handle arrays recursively
    if (Array.isArray(obj))
      return obj.map((item) => this.reserializeBigInt(item));

    // Handle objects recursively
    if (typeof obj === 'object')
      return Object.keys(obj).reduce((acc, key) => {
        acc[key] = this.reserializeBigInt(obj[key]);
        return acc;
      }, {});

    return obj;
  }
}
