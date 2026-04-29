/**
 * Sales tax rate applied to every order line item.
 * 6.75% — update this if the applicable tax jurisdiction changes.
 * Used in `CreateOrderCommandHandler` and `CalculateOrderAmount`.
 */
export const TAX_RATE = Number.parseFloat(process.env.TAX_RATE ?? '6.75') / 100;

/**
 * Membership level assigned to newly created customers.
 * Customers are upgraded by an admin or loyalty process after joining.
 */
export const DEFAULT_MEMBERSHIP_LEVEL = 'Regular';

/**
 * Default user ID used when no user is authenticated.
 * TODO: Remove this once we have proper authentication.
 */
export const DEFAULT_USER_ID = process.env.DEFAULT_USER_ID ?? 9;
