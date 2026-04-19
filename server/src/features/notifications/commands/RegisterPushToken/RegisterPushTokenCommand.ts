/**
 * Command to store a device's Expo push token against the authenticated
 * customer so the server can send push notifications for order events,
 * shipping updates, and promotional alerts.
 */
export class RegisterPushTokenCommand {
  constructor(
    public readonly customerId: number,
    public readonly token: string,
  ) {}
}
