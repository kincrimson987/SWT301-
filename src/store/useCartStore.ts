'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { CartItem, CartTotals } from '@/types/cart';
import { Game } from '@/types/game';
import { Coupon } from '@/types/coupon';
import { DEMO_COUPONS } from '@/data/coupons';
import { calculateCartTotals } from '@/utils/cartCalculations';

interface CartState {
  items: CartItem[];
  appliedCoupon: Coupon | null;
  hasHydrated: boolean;
  setHasHydrated: (state: boolean) => void;
  addToCart: (game: Game, quantity?: number) => { success: boolean; message: string };
  removeFromCart: (gameId: string) => { couponRevoked: boolean; message?: string };
  updateQuantity: (gameId: string, quantity: number) => { couponRevoked: boolean; message?: string };
  clearCart: () => void;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  getTotals: () => CartTotals;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      appliedCoupon: null,
      hasHydrated: false,
      setHasHydrated: (state) => set({ hasHydrated: state }),

      addToCart: (game: Game, quantity = 1) => {
        if (!game || !game.id) {
          return { success: false, message: 'Sản phẩm không hợp lệ' };
        }
        if (!game.inStock) {
          return {
            success: false,
            message: `Sản phẩm "${game.title}" hiện đã hết hàng, không thể thêm vào giỏ.`,
          };
        }

        const validQuantity = Math.max(1, Math.floor(quantity));
        const currentItems = get().items;
        const existingIndex = currentItems.findIndex(
          (item) => item.game.id === game.id
        );

        let newItems: CartItem[];
        if (existingIndex > -1) {
          newItems = currentItems.map((item, index) =>
            index === existingIndex
              ? { ...item, quantity: item.quantity + validQuantity }
              : item
          );
        } else {
          newItems = [...currentItems, { game, quantity: validQuantity }];
        }

        set({ items: newItems });
        return {
          success: true,
          message: `Đã thêm "${game.title}" (x${validQuantity}) vào giỏ hàng thành công!`,
        };
      },

      removeFromCart: (gameId: string) => {
        let couponRevoked = false;
        let message: string | undefined;

        set((state) => {
          const newItems = state.items.filter((item) => item.game.id !== gameId);
          let newCoupon = state.appliedCoupon;

          if (newCoupon) {
            const newSubtotal = newItems.reduce(
              (acc, curr) => acc + curr.game.currentPrice * curr.quantity,
              0
            );
            if (newSubtotal < newCoupon.minOrderValue) {
              couponRevoked = true;
              message = `Mã giảm giá "${newCoupon.code}" đã tự động hủy do đơn hàng không còn đạt mức tối thiểu ${new Intl.NumberFormat('vi-VN').format(newCoupon.minOrderValue)} ₫.`;
              newCoupon = null;
            }
          }
          return { items: newItems, appliedCoupon: newCoupon };
        });

        return { couponRevoked, message };
      },

      updateQuantity: (gameId: string, quantity: number) => {
        // Luôn đảm bảo số lượng >= 1
        const validQuantity = Math.max(1, Math.floor(quantity));
        let couponRevoked = false;
        let message: string | undefined;

        set((state) => {
          const newItems = state.items.map((item) =>
            item.game.id === gameId ? { ...item, quantity: validQuantity } : item
          );
          let newCoupon = state.appliedCoupon;

          if (newCoupon) {
            const newSubtotal = newItems.reduce(
              (acc, curr) => acc + curr.game.currentPrice * curr.quantity,
              0
            );
            if (newSubtotal < newCoupon.minOrderValue) {
              couponRevoked = true;
              message = `Mã giảm giá "${newCoupon.code}" đã tự động hủy do đơn hàng không còn đạt mức tối thiểu ${new Intl.NumberFormat('vi-VN').format(newCoupon.minOrderValue)} ₫.`;
              newCoupon = null;
            }
          }
          return { items: newItems, appliedCoupon: newCoupon };
        });

        return { couponRevoked, message };
      },

      clearCart: () => {
        set({ items: [], appliedCoupon: null });
      },

      applyCoupon: (rawCode: string) => {
        const cleanCode = rawCode.trim().toUpperCase();
        if (!cleanCode) {
          return { success: false, message: 'Vui lòng nhập mã giảm giá' };
        }

        const coupon = DEMO_COUPONS.find(
          (c) => c.code.toUpperCase() === cleanCode
        );

        if (!coupon) {
          return {
            success: false,
            message: `Mã giảm giá "${cleanCode}" không tồn tại trên hệ thống.`,
          };
        }

        if (!coupon.isValid) {
          return {
            success: false,
            message: coupon.invalidReason || 'Mã giảm giá này hiện không còn hợp lệ.',
          };
        }

        const currentSubtotal = get().items.reduce(
          (acc, item) => acc + item.game.currentPrice * item.quantity,
          0
        );

        if (currentSubtotal === 0) {
          return {
            success: false,
            message: 'Giỏ hàng đang trống, không thể áp dụng mã giảm giá.',
          };
        }

        if (currentSubtotal < coupon.minOrderValue) {
          return {
            success: false,
            message: `Đơn hàng tối thiểu cần đạt ${new Intl.NumberFormat('vi-VN').format(
              coupon.minOrderValue
            )} ₫ để áp dụng mã "${coupon.code}".`,
          };
        }

        set({ appliedCoupon: coupon });
        return {
          success: true,
          message: `Áp dụng thành công mã "${coupon.code}": ${coupon.description}`,
        };
      },

      removeCoupon: () => {
        set({ appliedCoupon: null });
      },

      getTotals: () => {
        const { items, appliedCoupon } = get();
        return calculateCartTotals(items, appliedCoupon);
      },
    }),
    {
      name: 'gamehub-cart-storage',
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
