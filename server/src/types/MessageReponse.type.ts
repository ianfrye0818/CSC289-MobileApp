import { HttpStatus } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

/**
 * Generic base class for structured API responses.
 *
 * All mutation endpoints (create, update, delete) return one of the concrete
 * subclasses below rather than raw objects. This gives the mobile app a
 * consistent shape to parse regardless of which endpoint was called.
 *
 * @template T - The type of the `data` payload (defaults to `null` for
 *   responses that don't carry a body beyond the message).
 */
export class MessageResponse<T = null> {
  @ApiProperty({ type: Number, required: true })
  statusCode: number;

  @ApiProperty({ type: String, required: true })
  message: string;

  @ApiProperty({ type: Object, required: false, additionalProperties: true })
  data?: T;

  constructor(message: string, statusCode: number, data: T) {
    this.data = data;
    this.message = message;
    this.statusCode = statusCode;
  }
}

/**
 * Response for successful update operations (HTTP 200).
 * Returns the updated resource's `id` so the client can invalidate its cache.
 */
export class UpdatedMessageResponse extends MessageResponse<{ id: number }> {
  constructor(message: string, id: number) {
    super(message, HttpStatus.OK, { id });
  }
}

/**
 * Response for successful create operations (HTTP 201).
 * Returns the newly created resource's `id` so the client can navigate to it.
 */
export class CreatedMessageResponse extends MessageResponse<{ id: number }> {
  constructor(message: string, id: number) {
    super(message, HttpStatus.CREATED, { id });
  }
}

/**
 * Response for successful delete operations (HTTP 204).
 * Optionally returns the deleted resource's `id` for client-side cache
 * invalidation.
 */
export class DeletedMessageResponse extends MessageResponse<{ id?: number }> {
  constructor(message: string, id?: number) {
    super(message, HttpStatus.NO_CONTENT, { id });
  }
}
