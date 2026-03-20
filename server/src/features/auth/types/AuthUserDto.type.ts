/**
 * The user payload embedded in the JWT and attached to `request.user`.
 *
 * This DTO is the subset of customer data that travels with every authenticated
 * request. It is produced by `JwtStrategy.validate()` and consumed by the
 * `@User()` decorator in controllers and handlers.
 *
 * Keep this minimal — every field here is decoded from the JWT on every request.
 * Sensitive data (password, address, etc.) lives only in the database.
 */
export class AuthUserDto {
  /** The customer's primary key. */
  id: number;
  /** The customer's email address (unique, used as login identifier). */
  email: string;
  /** The customer's full name (`First_Name + Last_Name`). */
  name: string;
}
