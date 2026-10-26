'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Game } from '@/types/game';
import { useCartStore } from './useCartStore';

interface WishlistState {
  wishlist: Game[];
  hasHydrated: boolean;
  setHasHydrated: (state: boolean) => void;
  addToWishlist: (game: Game) => void;
  removeFromWishlist: (gameId: string) => void;
  toggleWishlist: (game: Game) => boolean; // returns true if now in wishlist
  isInWishlist: (gameId: string) => boolean;
  moveToCart: (game: Game) => { success: boolean; message: string };
  clearWishlist: () => void;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      wishlist: [],
      hasHydrated: false,
      setHasHydrated: (state) => set({ hasHydrated: state }),

      addToWishlist: (game: Game) => {
        if (!get().isInWishlist(game.id)) {
          set((state) => ({ wishlist: [...state.wishlist, game] }));
        }
      },

      removeFromWishlist: (gameId: string) => {
        set((state) => ({
          wishlist: state.wishlist.filter((g) => g.id !== gameId),
        }));
      },

      toggleWishlist: (game: Game) => {
        const inList = get().isInWishlist(game.id);
        if (inList) {
          get().removeFromWishlist(game.id);
          return false;
        } else {
          get().addToWishlist(game);
          return true;
        }
      },

      isInWishlist: (gameId: string) => {
        return get().wishlist.some((g) => g.id === gameId);
      },

      moveToCart: (game: Game) => {
        const cartResult = useCartStore.getState().addToCart(game, 1);
        if (cartResult.success) {
          get().removeFromWishlist(game.id);
        }
        return cartResult;
      },

      clearWishlist: () => {
        set({ wishlist: [] });
      },
    }),
    {
      name: 'gamehub-wishlist-storage',
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
