import SecureStore from 'expo-secure-store';
import { create } from 'zustand';
import { AppUser } from './types';

/**
 * Shape of the authentication state managed by this store.
 *
 * `isLoading` starts as `true` because we need to read from SecureStore
 * (async) before we know whether the user is logged in. The root layout waits
 * for `isLoading` to be `false` before deciding which screen to show.
 */
type AuthStore = {
  /** Whether the user currently has a valid session. */
  isAuthenticated: boolean;
  /** JWT access token, or `null` if the user is not logged in. */
  token: string | null;
  /** The authenticated user's profile data, or `null` if not logged in. */
  user: AppUser | null;
  /** `true` while the store is reading persisted credentials on startup. */
  isLoading: boolean;
};

/** Reusable reset value — applied on logout or on initialization failure. */
const initialState: AuthStore = {
  isAuthenticated: false,
  token: null,
  user: null,
  isLoading: true,
};

/**
 * Actions that can mutate the auth state.
 * Each action that touches persisted data (`setToken`, `setUser`, `logout`)
 * is async because it writes to / reads from `expo-secure-store`.
 */
type Actions = {
  /** Manually set the `isAuthenticated` flag (useful after login flow). */
  setIsAuthenticated: (isAuthenticated: boolean) => void;
  /** Persist a new JWT token to SecureStore and update the in-memory state. */
  setToken: (token: string) => Promise<void>;
  /** Persist the user object to SecureStore and update the in-memory state. */
  setUser: (user: AppUser) => Promise<void>;
  /** Clear all credentials from SecureStore and reset the store to its initial state. */
  logout: () => Promise<void>;
  /**
   * Called once on app startup (see `app/_layout.tsx`).
   * Reads any previously stored token and user from SecureStore and hydrates
   * the store, so users stay logged in between sessions.
   */
  initialize: () => Promise<void>;
};

/**
 * Global authentication store built with Zustand.
 *
 * Use this store to read or update auth state from anywhere in the app.
 * Inside React components, subscribe to specific slices to avoid unnecessary
 * re-renders:
 *
 * @example
 * // Read a single value
 * const token = useAuthStore((s) => s.token);
 *
 * // Outside React (e.g. API middleware), use getState()
 * const token = useAuthStore.getState().token;
 */
export const useAuthStore = create<AuthStore & Actions>((set) => ({
  ...initialState,
  initialize: async () => {
    try {
      const [token, userJson] = await Promise.all([
        SecureStore.getItemAsync('token'),
        SecureStore.getItemAsync('user'),
      ]);
      if (token && userJson) {
        set({
          token,
          user: JSON.parse(userJson),
          isAuthenticated: true,
          isLoading: false,
        });
      } else {
        set({ ...initialState, isLoading: false });
      }
    } catch {
      set({ ...initialState, isLoading: false });
    }
  },
  setToken: async (token: string) => {
    await SecureStore.setItemAsync('token', token);
    set({ token });
  },
  setUser: async (user: AppUser) => {
    await SecureStore.setItemAsync('user', JSON.stringify(user));
    set({ user });
  },
  setIsAuthenticated: (isAuthenticated: boolean) => set({ isAuthenticated }),
  logout: async () => {
    await Promise.all([SecureStore.deleteItemAsync('token'), SecureStore.deleteItemAsync('user')]);
    set({ ...initialState, isLoading: false });
  },
}));
