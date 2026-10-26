import { Coupon } from '@/types/coupon';

export const DEMO_COUPONS: Coupon[] = [
  {
    code: 'GAMEHUB10',
    description: 'Giảm 10% trên tổng giá trị đơn hàng (không giới hạn)',
    type: 'percentage',
    value: 10,
    minOrderValue: 0,
    isValid: true,
  },
  {
    code: 'GAMEHUB50K',
    description: 'Giảm ngay 50.000 ₫ cho đơn từ 300.000 ₫',
    type: 'fixed',
    value: 50000,
    minOrderValue: 300000,
    isValid: true,
  },
  {
    code: 'VIP100K',
    description: 'Giảm 100.000 ₫ cho đơn hàng giá trị từ 800.000 ₫ trở lên',
    type: 'fixed',
    value: 100000,
    minOrderValue: 800000,
    isValid: true,
  },
  {
    code: 'EXPIRED20',
    description: 'Mã giảm giá 20% đã hết hạn sử dụng',
    type: 'percentage',
    value: 20,
    minOrderValue: 0,
    isValid: false,
    invalidReason: 'Mã giảm giá này đã hết hạn sử dụng vào 01/01/2026',
  },
];
