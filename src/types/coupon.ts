export type CouponType = 'percentage' | 'fixed';

export interface Coupon {
  code: string;
  description: string;
  type: CouponType;
  value: number; // e.g. 10 for 10%, or 50000 for 50,000 VND
  minOrderValue: number; // min subtotal required
  maxDiscount?: number; // optional cap for percentage discounts
  isValid: boolean;
  expiresAt?: string;
  invalidReason?: string;
}
