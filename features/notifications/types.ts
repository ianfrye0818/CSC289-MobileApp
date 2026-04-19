/**
 * Re-exported notification types.
 * Will be populated once the backend endpoint and generated types exist.
 */

export interface RegisterPushTokenRequest {
  /** The Expo push token returned by the device on registration.  */
  token: string;
}

export interface RegisterPushTokenResponse {
  /** Confirmation message from the server */
  message: string;
}
