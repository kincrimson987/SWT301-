import { CartItem, CartTotals } from '@/types/cart';
import { Coupon } from '@/types/coupon';

/**
 * Hàm tính tổng tiền duy nhất, chuẩn xác dựa trên số nguyên VND.
 * Không phụ thuộc vào chuỗi hiển thị hay DOM.
 */
export function calculateCartTotals(
  items: CartItem[],
  coupon: Coupon | null = null
): CartTotals {
  let itemCount = 0;
  let originalSubtotal = 0;
  let subtotal = 0;

  for (const item of items) {
    const qty = Math.max(1, Math.floor(item.quantity || 1));
    const currentPrice = Math.max(0, Math.round(item.game.currentPrice));
    const originalPrice = Math.max(
      currentPrice,
      Math.round(item.game.originalPrice || currentPrice)
    );

    itemCount += qty;
    subtotal += currentPrice * qty;
    originalSubtotal += originalPrice * qty;
  }

  const totalSavings = Math.max(0, originalSubtotal - subtotal);

  // Tính giảm giá từ Coupon
  let discountAmount = 0;
  if (coupon && coupon.isValid && subtotal >= (coupon.minOrderValue || 0)) {
    if (coupon.type === 'percentage') {
      discountAmount = Math.round((subtotal * coupon.value) / 100);
      if (coupon.maxDiscount && coupon.maxDiscount > 0) {
        discountAmount = Math.min(discountAmount, coupon.maxDiscount);
      }
    } else if (coupon.type === 'fixed') {
      discountAmount = Math.round(coupon.value);
    }
    // Giảm giá không bao giờ vượt quá subtotal
    discountAmount = Math.min(discountAmount, subtotal);
  }

  const finalTotal = Math.max(0, subtotal - discountAmount);

  return {
    itemCount,
    originalSubtotal,
    subtotal,
    totalSavings,
    discountAmount,
    finalTotal,
  };
}
