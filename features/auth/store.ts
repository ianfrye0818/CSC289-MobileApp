import { AppUser } from '@/types/AppUser.type';
import SecureStore from 'expo-secure-store';
import { create } from 'zustand';

type AuthStore = {
  isAuthenticated: boolean;
  token: string | null;
  user: AppUser | null;
  isLoading: boolean;
};

const initialState: AuthStore = {
  isAuthenticated: false,
  token: null,
  user: null,
  isLoading: true,
};

type Actions = {
  setIsAuthenticated: (isAuthenticated: boolean) => void;
  setToken: (token: string) => Promise<void>;
  setUser: (user: AppUser) => Promise<void>;
  logout: () => Promise<void>;
  initialize: () => Promise<void>;
};

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
          user: JSON.parse(userJson) as AppUser,
          isAuthenticated: true,
          isLoading: false,
        });
      } else {
        set({
          ...initialState,
          isLoading: false,
        });
      }
    } catch (error) {
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
    set({ ...initialState });
  },
}));
