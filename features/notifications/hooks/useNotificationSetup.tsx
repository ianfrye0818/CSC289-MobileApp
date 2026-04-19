import { useAuthStore } from "@/features/auth/store";
import { usePushNotifications } from "@/hooks/usePushNotifications";
import { useEffect } from "react";
import { useRegisterPushToken } from "./useRegisterPushToken";

/**
 * Mount once at the root — inside the `QueryClientProvider` ancestor — so we
 * start the permission / token dance as early as possible. The mutation that
 * sends the token to the backend is gated on `isAuthenticated` so we don't
 * hit the protected endpoint while the user is logged out.
 */
export const useNotificationSetup = () => {
  const { expoPushToken } = usePushNotifications();
  const { mutate: registerToken } = useRegisterPushToken();
  // Auth-gate: the `POST /notifications/register-token` endpoint needs a
  // signed-in user; firing before login would 401 and burn a retry budget.
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  useEffect(() => {
    if (expoPushToken?.data && isAuthenticated) {
      registerToken({ token: expoPushToken.data });
    }
  }, [expoPushToken, isAuthenticated]);
};
