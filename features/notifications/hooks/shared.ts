// Query-key factory for anything the notifications feature caches in React Query.
// Self-referential — `.token()` must use `notificationQueryKeys.all`, not the
// typo'd plural that was here previously (would ReferenceError on first call).
export const notificationQueryKeys = {
  all: ["notifications"] as const,
  token: () => [...notificationQueryKeys.all, "token"] as const,
};
