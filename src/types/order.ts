import { CartItem } from './cart';
import { Coupon } from './coupon';

export interface CustomerInfo {
  fullName: string;
  email: string;
  phone: string;
  note?: string;
}

export type PaymentMethod = 'qr_pay' | 'momo' | 'atm_card';

export interface PurchasedGameKey {
  gameId: string;
  gameTitle: string;
  licenseKey: string;
}

export interface Order {
  id: string; // GH-xxxxxx
  createdAt: string;
  customer: CustomerInfo;
  items: CartItem[];
  paymentMethod: PaymentMethod;
  appliedCoupon: Coupon | null;
  subtotal: number;
  discountAmount: number;
  finalTotal: number;
  paymentStatus: 'paid_demo' | 'pending';
  licenseKeys: PurchasedGameKey[];
}
