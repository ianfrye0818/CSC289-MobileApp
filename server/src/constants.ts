/**
 * Sales tax rate applied to every order line item.
 * 6.75% — update this if the applicable tax jurisdiction changes.
 * Used in `CreateOrderCommandHandler` and `CalculateOrderAmount`.
 */
export const TAX_RATE = 0.0675;

/**
 * Membership level assigned to newly created customers.
 * Customers are upgraded by an admin or loyalty process after joining.
 */
export const DEFAULT_MEMBERSHIP_LEVEL = 'Regular';
