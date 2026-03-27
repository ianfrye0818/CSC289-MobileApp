import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export type WishlistProduct = {
  id: number;
  name: string;
  price: number;
  imageUrl: string;
};

type WishlistStore = {
  items: WishlistProduct[];
  addItem: (item: WishlistProduct) => void;
  removeItem: (id: number) => void;
  isInWishlist: (id: number) => boolean;
  clearWishlist: () => void;
};

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product) =>
        set((state) => ({
          items: state.items.some((i) => i.id === product.id)
            ? state.items // don't add duplicates
            : [...state.items, product],
        })),

      removeItem: (id) =>
        set((state) => ({
          items: state.items.filter((i) => i.id !== id),
        })),

      isInWishlist: (id) => get().items.some((i) => i.id === id),

      clearWishlist: () => set({ items: [] }),
    }),
    {
      name: 'wishlist',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
