'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShoppingBag,
  Tag,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  X,
  Sparkles,
} from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import { formatVND } from '@/utils/formatters';
import { useToast } from '@/components/ui/Toast';

export default function CartPage() {
  const router = useRouter();
  const { showToast } = useToast();

  const [mounted, setMounted] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [couponFeedback, setCouponFeedback] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  const {
    items,
    appliedCoupon,
    updateQuantity,
    removeFromCart,
    clearCart,
    applyCoupon,
    removeCoupon,
    getTotals,
  } = useCartStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center text-slate-400">
        Đang tải thông tin giỏ hàng...
      </div>
    );
  }

  const totals = getTotals();

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCode = couponCode.trim();
    if (!cleanCode) {
      setCouponFeedback({
        type: 'error',
        message: 'Vui lòng nhập mã giảm giá trước khi áp dụng.',
      });
      return;
    }

    const res = applyCoupon(cleanCode);
    if (res.success) {
      setCouponFeedback({ type: 'success', message: res.message });
      showToast(res.message, 'success');
      setCouponCode('');
    } else {
      setCouponFeedback({ type: 'error', message: res.message });
      showToast(res.message, 'error');
    }
  };

  const handleRemoveCoupon = () => {
    removeCoupon();
    setCouponFeedback(null);
    showToast('Đã hủy áp dụng mã giảm giá.', 'info');
  };

  const handleQuantityInputChange = (gameId: string, value: string) => {
    const parsed = parseInt(value, 10);
    if (isNaN(parsed) || parsed < 1) {
      const res = updateQuantity(gameId, 1);
      if (res.couponRevoked && res.message) {
        showToast(res.message, 'error');
        setCouponFeedback({ type: 'error', message: res.message });
      }
    } else {
      const res = updateQuantity(gameId, parsed);
      if (res.couponRevoked && res.message) {
        showToast(res.message, 'error');
        setCouponFeedback({ type: 'error', message: res.message });
      }
    }
  };

  const handleDecreaseQuantity = (gameId: string, currentQty: number) => {
    if (currentQty <= 1) {
      showToast('Số lượng tối thiểu là 1. Nếu không muốn mua, vui lòng nhấn biểu tượng thùng rác để xóa game.', 'info');
      return;
    }
    const res = updateQuantity(gameId, currentQty - 1);
    if (res.couponRevoked && res.message) {
      showToast(res.message, 'error');
      setCouponFeedback({ type: 'error', message: res.message });
    }
  };

  const handleIncreaseQuantity = (gameId: string, currentQty: number) => {
    const res = updateQuantity(gameId, currentQty + 1);
    if (res.couponRevoked && res.message) {
      showToast(res.message, 'error');
      setCouponFeedback({ type: 'error', message: res.message });
    }
  };

  const handleRemoveItem = (gameId: string, title: string) => {
    const res = removeFromCart(gameId);
    showToast(`Đã xóa "${title}" khỏi giỏ hàng.`, 'info');
    if (res.couponRevoked && res.message) {
      showToast(res.message, 'error');
      setCouponFeedback({ type: 'error', message: res.message });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full flex flex-col gap-8">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
            <ShoppingCart className="w-8 h-8 text-cyan-400" />
            Giỏ Hàng Của Bạn
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Kiểm tra danh sách trò chơi kỹ thuật số đã chọn trước khi tiến hành thanh toán
          </p>
        </div>

        {items.length > 0 && (
          <button
            type="button"
            onClick={() => {
              clearCart();
              setCouponFeedback(null);
              showToast('Đã dọn sạch toàn bộ giỏ hàng.', 'info');
            }}
            data-testid="clear-cart-button"
            className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1.5 self-start sm:self-auto transition-colors cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Xóa toàn bộ giỏ hàng</span>
          </button>
        )}
      </div>

      {items.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Cart Items List (8 cols) */}
          <div className="lg:col-span-8 space-y-4" data-testid="cart-items-container">
            {items.map((item) => {
              const itemTotal = item.game.currentPrice * item.quantity;
              const itemOriginalTotal =
                (item.game.originalPrice || item.game.currentPrice) *
                item.quantity;

              return (
                <div
                  key={item.game.id}
                  data-testid="cart-item-row"
                  data-game-id={item.game.id}
                  className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-md transition-all hover:border-slate-700"
                >
                  {/* Left: Thumbnail & Name */}
                  <div className="flex items-center gap-4 w-full sm:w-auto">
                    <Link
                      href={`/store/${item.game.slug}`}
                      className="aspect-[16/10] w-24 sm:w-28 rounded-xl overflow-hidden bg-slate-950 shrink-0 border border-slate-800"
                    >
                      <img
                        src={item.game.coverImage}
                        alt={item.game.title}
                        className="w-full h-full object-cover"
                      />
                    </Link>

                    <div className="flex flex-col">
                      <span className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider">
                        {item.game.genre}
                      </span>
                      <Link
                        href={`/store/${item.game.slug}`}
                        className="text-sm sm:text-base font-bold text-slate-100 hover:text-cyan-400 line-clamp-1 transition-colors"
                      >
                        {item.game.title}
                      </Link>
                      <div className="flex items-center gap-2 mt-1">
                        <span
                          data-testid="cart-item-price"
                          className="text-xs sm:text-sm font-bold text-slate-200"
                        >
                          {formatVND(item.game.currentPrice)}
                        </span>
                        {item.game.isDiscounted &&
                          item.game.originalPrice > item.game.currentPrice && (
                            <span className="text-[11px] text-slate-400 line-through">
                              {formatVND(item.game.originalPrice)}
                            </span>
                          )}
                      </div>
                    </div>
                  </div>

                  {/* Right: Quantity picker, item total, and remove button */}
                  <div className="flex items-center justify-between sm:justify-end gap-5 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-800/80">
                    {/* Quantity controls */}
                    <div className="flex items-center bg-slate-950 border border-slate-800 rounded-xl overflow-hidden">
                      <button
                        type="button"
                        onClick={() => handleDecreaseQuantity(item.game.id, item.quantity)}
                        data-testid="cart-decrease-qty"
                        className="p-2 text-slate-400 hover:text-white transition-colors cursor-pointer"
                        aria-label="Giảm số lượng"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>

                      {/* Display quantity and support input for boundary testing */}
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => handleQuantityInputChange(item.game.id, e.target.value)}
                        data-testid="cart-quantity-input"
                        aria-label="Số lượng sản phẩm"
                        className="w-12 text-center text-xs font-bold text-white bg-transparent outline-none focus:bg-slate-900 border-x border-slate-800/80 py-1"
                      />
                      <span
                        data-testid="cart-item-quantity"
                        className="sr-only"
                      >
                        {item.quantity}
                      </span>

                      <button
                        type="button"
                        onClick={() => handleIncreaseQuantity(item.game.id, item.quantity)}
                        data-testid="cart-increase-qty"
                        className="p-2 text-slate-400 hover:text-white transition-colors cursor-pointer"
                        aria-label="Tăng số lượng"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Subtotal for this item */}
                    <div className="flex flex-col text-right min-w-[100px]">
                      <span className="text-[10px] text-slate-400 uppercase font-semibold">
                        Thành tiền
                      </span>
                      <span
                        data-testid="cart-item-total"
                        className="text-sm sm:text-base font-extrabold text-cyan-400"
                      >
                        {formatVND(itemTotal)}
                      </span>
                    </div>

                    {/* Delete item button */}
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(item.game.id, item.game.title)}
                      data-testid="cart-remove-item"
                      className="p-2 rounded-xl text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition-colors cursor-pointer"
                      aria-label="Xóa sản phẩm"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}

            {/* Back to store link */}
            <div className="pt-2">
              <Link
                href="/store"
                data-testid="continue-shopping-button"
                className="inline-flex items-center gap-2 text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition-colors"
              >
                <span>← Tiếp tục chọn thêm game khác</span>
              </Link>
            </div>
          </div>

          {/* Order Summary & Coupon (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-slate-900/90 border border-slate-800/80 rounded-2xl p-6 space-y-6 shadow-xl sticky top-28">
              <h3 className="text-base font-bold text-white tracking-tight border-b border-slate-800 pb-3">
                Tóm Tắt Đơn Hàng
              </h3>

              {/* Coupon Form */}
              <div className="space-y-2.5">
                <label htmlFor="cart-coupon-input" className="text-xs font-semibold text-slate-300 block">
                  Mã Giảm Giá GameHub
                </label>

                {appliedCoupon ? (
                  <div
                    data-testid="applied-coupon-box"
                    className="flex items-center justify-between p-3 rounded-xl bg-indigo-950/60 border border-indigo-500/40 text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <Tag className="w-4 h-4 text-cyan-400 shrink-0" />
                      <div>
                        <span
                          data-testid="applied-coupon-code"
                          className="font-bold text-white font-mono uppercase"
                        >
                          {appliedCoupon.code}
                        </span>
                        <p className="text-[11px] text-slate-300">
                          {appliedCoupon.description}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleRemoveCoupon}
                      data-testid="remove-coupon-button"
                      className="text-slate-400 hover:text-rose-400 p-1 transition-colors cursor-pointer"
                      aria-label="Gỡ mã giảm giá"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <input
                      id="cart-coupon-input"
                      type="text"
                      placeholder="Mã: GAMEHUB10 hoặc GAMEHUB50K"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                      data-testid="coupon-input"
                      className="w-full bg-slate-950 text-xs font-mono uppercase text-slate-200 placeholder-slate-500 px-3 py-2.5 rounded-xl border border-slate-800 focus:border-cyan-500 outline-none"
                    />
                    <button
                      type="submit"
                      data-testid="apply-coupon-button"
                      className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl transition-all shrink-0 cursor-pointer"
                    >
                      Áp dụng
                    </button>
                  </form>
                )}

                {/* Coupon feedback alert */}
                {couponFeedback && (
                  <div
                    data-testid={couponFeedback.type === 'success' ? 'coupon-success-message' : 'coupon-error-message'}
                    className={`text-xs p-2.5 rounded-lg flex items-start gap-2 ${
                      couponFeedback.type === 'success'
                        ? 'bg-emerald-950/60 border border-emerald-600/40 text-emerald-300'
                        : 'bg-rose-950/60 border border-rose-600/40 text-rose-300'
                    }`}
                  >
                    {couponFeedback.type === 'success' ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                    )}
                    <span data-testid="coupon-feedback-text">{couponFeedback.message}</span>
                  </div>
                )}
              </div>

              {/* Price Breakdown */}
              <div className="divide-y divide-slate-800/80 text-xs space-y-3 pt-2">
                <div className="flex justify-between text-slate-300 pt-2">
                  <span>Tổng số lượng game:</span>
                  <span data-testid="summary-item-count" className="font-bold text-white">
                    {totals.itemCount} sản phẩm
                  </span>
                </div>

                <div className="flex justify-between text-slate-300 pt-3">
                  <span>Tổng tiền niêm yết:</span>
                  <span
                    data-testid="summary-original-subtotal"
                    className="text-slate-400 line-through"
                  >
                    {formatVND(totals.originalSubtotal)}
                  </span>
                </div>

                <div className="flex justify-between text-slate-300 pt-3">
                  <span>Tạm tính (giá bán hiện tại):</span>
                  <span
                    data-testid="summary-subtotal"
                    className="font-bold text-white text-sm"
                  >
                    {formatVND(totals.subtotal)}
                  </span>
                </div>

                {totals.totalSavings > 0 && (
                  <div className="flex justify-between text-emerald-400 pt-3">
                    <span>Đã tiết kiệm từ khuyến mãi game:</span>
                    <span data-testid="summary-savings" className="font-semibold">
                      -{formatVND(totals.totalSavings)}
                    </span>
                  </div>
                )}

                {totals.discountAmount > 0 && (
                  <div className="flex justify-between text-cyan-400 pt-3">
                    <span>Mã giảm giá đã áp dụng:</span>
                    <span data-testid="summary-discount-amount" className="font-bold">
                      -{formatVND(totals.discountAmount)}
                    </span>
                  </div>
                )}

                <div className="flex justify-between text-base font-extrabold text-white pt-4">
                  <span>Tổng thanh toán:</span>
                  <span
                    data-testid="summary-final-total"
                    className="text-xl text-cyan-400 tracking-tight"
                  >
                    {formatVND(totals.finalTotal)}
                  </span>
                </div>
              </div>

              {/* Checkout Button */}
              <Link
                href="/checkout"
                data-testid="proceed-to-checkout-button"
                className="w-full py-4 px-6 rounded-xl font-black text-sm bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white shadow-xl shadow-indigo-600/25 transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2"
              >
                <span>Tiến hành thanh toán</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      ) : (
        /* Empty Cart State */
        <div
          data-testid="empty-cart-state"
          className="flex flex-col items-center justify-center py-20 px-4 text-center bg-slate-900/40 rounded-3xl border border-dashed border-slate-800 space-y-5"
        >
          <div className="w-20 h-20 rounded-3xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-center text-slate-400 shadow-inner">
            <ShoppingBag className="w-10 h-10" />
          </div>
          <div className="space-y-1">
            <h2 className="text-2xl font-black text-white">Giỏ hàng của bạn đang trống</h2>
            <p className="text-xs sm:text-sm text-slate-400 max-w-md">
              Chưa có trò chơi nào được thêm vào giỏ hàng. Hãy khám phá hàng trăm tựa game hấp dẫn với ưu đãi giảm giá tốt nhất hôm nay!
            </p>
          </div>

          <Link
            href="/store"
            data-testid="empty-cart-explore-button"
            className="px-6 py-3.5 rounded-xl font-bold text-xs bg-gradient-to-r from-indigo-600 to-cyan-500 text-white shadow-lg shadow-indigo-600/25 hover:scale-105 transition-all flex items-center gap-2"
          >
            <ShoppingCart className="w-4 h-4" />
            Khám phá kho game ngay
          </Link>
        </div>
      )}
    </div>
  );
}
