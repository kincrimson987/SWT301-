'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Order, CustomerInfo, PaymentMethod, PurchasedGameKey } from '@/types/order';
import { CartItem } from '@/types/cart';
import { Coupon } from '@/types/coupon';
import { generateOrderId, generateGameKey } from '@/utils/formatters';

interface OrderState {
  orders: Order[];
  lastCreatedOrder: Order | null;
  hasHydrated: boolean;
  setHasHydrated: (state: boolean) => void;
  createOrder: (data: {
    customer: CustomerInfo;
    items: CartItem[];
    paymentMethod: PaymentMethod;
    appliedCoupon: Coupon | null;
    subtotal: number;
    discountAmount: number;
    finalTotal: number;
  }) => { success: boolean; orderId?: string; message: string };
  getOrderById: (orderId: string) => Order | undefined;
}

export const useOrderStore = create<OrderState>()(
  persist(
    (set, get) => ({
      orders: [],
      lastCreatedOrder: null,
      hasHydrated: false,
      setHasHydrated: (state) => set({ hasHydrated: state }),

      createOrder: ({
        customer,
        items,
        paymentMethod,
        appliedCoupon,
        subtotal,
        discountAmount,
        finalTotal,
      }) => {
        if (!items || items.length === 0) {
          return {
            success: false,
            message: 'Giỏ hàng đang trống, không thể tạo đơn hàng.',
          };
        }

        // Sinh danh sách key kích hoạt demo cho từng game đã mua
        const licenseKeys: PurchasedGameKey[] = [];
        for (const item of items) {
          for (let i = 0; i < item.quantity; i++) {
            licenseKeys.push({
              gameId: item.game.id,
              gameTitle: item.game.title,
              licenseKey: generateGameKey(),
            });
          }
        }

        const newOrder: Order = {
          id: generateOrderId(),
          createdAt: new Date().toISOString(),
          customer,
          items,
          paymentMethod,
          appliedCoupon,
          subtotal,
          discountAmount,
          finalTotal,
          paymentStatus: 'paid_demo',
          licenseKeys,
        };

        set((state) => ({
          orders: [newOrder, ...state.orders],
          lastCreatedOrder: newOrder,
        }));

        return {
          success: true,
          orderId: newOrder.id,
          message: 'Đặt hàng thành công!',
        };
      },

      getOrderById: (orderId: string) => {
        return get().orders.find((o) => o.id === orderId);
      },
    }),
    {
      name: 'gamehub-orders-storage',
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
