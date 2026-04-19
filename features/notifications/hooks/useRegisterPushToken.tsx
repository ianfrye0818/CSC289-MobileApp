import { apiClient } from "@/lib/apiClient";
import { unwrapResponse } from "@/lib/unwrapResponse";
import { useMutation } from "@tanstack/react-query";
import { RegisterPushTokenRequest } from "../types";

/**
 * Sends the device's Expo push token to the server so the backend
 * can send push notifications to this device for order events,
 * shipping updates, and promotional alerts.
 *
 * Called once after login when the app registers for notifications.
 */
export const useRegisterPushToken = () =>
  useMutation({
    mutationFn: (dto: RegisterPushTokenRequest) =>
      apiClient
        .POST("/api/notifications/register-token", { body: dto })
        .then(unwrapResponse),
  });
