'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  CreditCard,
  QrCode,
  Smartphone,
  ShieldCheck,
  Lock,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  Package,
} from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import { useAuthStore } from '@/store/useAuthStore';
import { useOrderStore } from '@/store/useOrderStore';
import { formatVND } from '@/utils/formatters';
import { PaymentMethod } from '@/types/order';
import { useToast } from '@/components/ui/Toast';

export default function CheckoutPage() {
  const router = useRouter();
  const { showToast } = useToast();

  const [mounted, setMounted] = useState(false);
  const { items, appliedCoupon, getTotals, clearCart } = useCartStore();
  const { currentUser } = useAuthStore();
  const { createOrder } = useOrderStore();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [note, setNote] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('qr_pay');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    setMounted(true);
    if (currentUser) {
      setFullName(currentUser.name);
      setEmail(currentUser.email);
    }
  }, [currentUser]);

  if (!mounted) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center text-slate-400">
        Đang tải thông tin thanh toán...
      </div>
    );
  }

  // If cart is empty, block checkout flow
  if (items.length === 0) {
    return (
      <div
        data-testid="empty-checkout-block"
        className="max-w-3xl mx-auto px-4 py-20 text-center space-y-4"
      >
        <div className="w-16 h-16 rounded-2xl bg-rose-950/40 border border-rose-800/40 text-rose-400 flex items-center justify-center mx-auto">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-white">Giỏ hàng đang trống</h2>
        <p className="text-sm text-slate-400 max-w-md mx-auto">
          Bạn không thể tiến hành thanh toán khi chưa có sản phẩm nào trong giỏ hàng. Vui lòng thêm ít nhất một game PC để tiếp tục.
        </p>
        <Link
          href="/store"
          data-testid="return-to-store-button"
          className="inline-block px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-all"
        >
          Đến Cửa Hàng Mua Game
        </Link>
      </div>
    );
  }

  const totals = getTotals();

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const cleanName = fullName.trim();
    const cleanEmail = email.trim();
    const cleanPhone = phone.trim();

    if (!cleanName || !cleanEmail || !cleanPhone) {
      setErrorMessage('Vui lòng điền đầy đủ họ tên, email và số điện thoại nhận key.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      setErrorMessage('Địa chỉ email nhận key không đúng định dạng.');
      return;
    }

    // Phone validation: exactly 10-11 digits starting with 0
    const phoneRegex = /^0[0-9]{9,10}$/;
    if (!phoneRegex.test(cleanPhone)) {
      setErrorMessage('Số điện thoại không hợp lệ (phải bắt đầu bằng số 0 và có từ 10 đến 11 chữ số).');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const result = createOrder({
        customer: {
          fullName: cleanName,
          email: cleanEmail,
          phone: cleanPhone,
          note: note.trim(),
        },
        items,
        paymentMethod,
        appliedCoupon,
        subtotal: totals.subtotal,
        discountAmount: totals.discountAmount,
        finalTotal: totals.finalTotal,
      });

      if (result.success && result.orderId) {
        clearCart();
        showToast('Đặt hàng demo thành công! Đang chuyển đến trang xác nhận...', 'success');
        router.push(`/checkout/success?orderId=${result.orderId}`);
      } else {
        setIsSubmitting(false);
        setErrorMessage(result.message);
        showToast(result.message, 'error');
      }
    }, 500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
          <ShieldCheck className="w-8 h-8 text-cyan-400" />
          Thanh Toán Đơn Hàng Demo
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Hệ thống mô phỏng xác nhận đơn hàng và tạo License Key bản quyền kỹ thuật số tức thì
        </p>
      </div>

      <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Customer Info & Payment Selector (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Customer info card */}
          <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-6 space-y-4">
            <h2 className="text-base font-bold text-white tracking-tight border-b border-slate-800 pb-3 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center text-xs font-bold">
                1
              </span>
              Thông Tin Người Nhận Key Game
            </h2>

            {errorMessage && (
              <div
                data-testid="checkout-error-alert"
                className="p-3.5 rounded-xl bg-rose-950/80 border border-rose-500/50 text-rose-200 text-xs flex items-center gap-2 animate-in fade-in"
              >
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                <span data-testid="checkout-error-text">{errorMessage}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5 sm:col-span-2">
                <label htmlFor="checkout-fullname" className="text-xs font-semibold text-slate-300 block">
                  Họ và tên người nhận <span className="text-rose-500">*</span>
                </label>
                <input
                  id="checkout-fullname"
                  type="text"
                  required
                  placeholder="ví dụ: Nguyễn Hoàng Long"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  data-testid="checkout-fullname-input"
                  className="w-full bg-slate-950 text-xs text-slate-200 placeholder-slate-500 px-4 py-2.5 rounded-xl border border-slate-800 focus:border-cyan-500 outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="checkout-email" className="text-xs font-semibold text-slate-300 block">
                  Email nhận key <span className="text-rose-500">*</span>
                </label>
                <input
                  id="checkout-email"
                  type="email"
                  required
                  placeholder="ví dụ: gamer@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  data-testid="checkout-email-input"
                  className="w-full bg-slate-950 text-xs text-slate-200 placeholder-slate-500 px-4 py-2.5 rounded-xl border border-slate-800 focus:border-cyan-500 outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="checkout-phone" className="text-xs font-semibold text-slate-300 block">
                  Số điện thoại <span className="text-rose-500">*</span>
                </label>
                <input
                  id="checkout-phone"
                  type="tel"
                  required
                  placeholder="ví dụ: 0912345678"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  data-testid="checkout-phone-input"
                  className="w-full bg-slate-950 text-xs text-slate-200 placeholder-slate-500 px-4 py-2.5 rounded-xl border border-slate-800 focus:border-cyan-500 outline-none"
                />
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <label htmlFor="checkout-note" className="text-xs font-semibold text-slate-300 block">
                  Ghi chú đơn hàng (tùy chọn)
                </label>
                <textarea
                  id="checkout-note"
                  rows={2}
                  placeholder="Lời nhắn hoặc yêu cầu hỗ trợ cấu hình..."
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  data-testid="checkout-note-input"
                  className="w-full bg-slate-950 text-xs text-slate-200 placeholder-slate-500 px-4 py-2 rounded-xl border border-slate-800 focus:border-cyan-500 outline-none resize-none"
                />
              </div>
            </div>
          </div>

          {/* Payment Method Selector */}
          <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-6 space-y-4">
            <h2 className="text-base font-bold text-white tracking-tight border-b border-slate-800 pb-3 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center text-xs font-bold">
                2
              </span>
              Phương Thức Thanh Toán Demo
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* QR Pay */}
              <label
                data-testid="payment-method-qr"
                className={`flex flex-col items-center justify-center p-4 rounded-xl border cursor-pointer transition-all text-center gap-2 ${
                  paymentMethod === 'qr_pay'
                    ? 'bg-cyan-950/40 border-cyan-500 text-white shadow-md shadow-cyan-500/10'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="qr_pay"
                  checked={paymentMethod === 'qr_pay'}
                  onChange={() => setPaymentMethod('qr_pay')}
                  className="sr-only"
                />
                <QrCode className="w-6 h-6 text-cyan-400" />
                <span className="text-xs font-bold">VietQR Demo</span>
                <span className="text-[10px] text-slate-400">Quét mã ngân hàng</span>
              </label>

              {/* Momo */}
              <label
                data-testid="payment-method-momo"
                className={`flex flex-col items-center justify-center p-4 rounded-xl border cursor-pointer transition-all text-center gap-2 ${
                  paymentMethod === 'momo'
                    ? 'bg-pink-950/40 border-pink-500 text-white shadow-md shadow-pink-500/10'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="momo"
                  checked={paymentMethod === 'momo'}
                  onChange={() => setPaymentMethod('momo')}
                  className="sr-only"
                />
                <Smartphone className="w-6 h-6 text-pink-400" />
                <span className="text-xs font-bold">Ví MoMo Demo</span>
                <span className="text-[10px] text-slate-400">Thanh toán ví điện tử</span>
              </label>

              {/* ATM / Card */}
              <label
                data-testid="payment-method-atm"
                className={`flex flex-col items-center justify-center p-4 rounded-xl border cursor-pointer transition-all text-center gap-2 ${
                  paymentMethod === 'atm_card'
                    ? 'bg-indigo-950/40 border-indigo-500 text-white shadow-md shadow-indigo-500/10'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="atm_card"
                  checked={paymentMethod === 'atm_card'}
                  onChange={() => setPaymentMethod('atm_card')}
                  className="sr-only"
                />
                <CreditCard className="w-6 h-6 text-indigo-400" />
                <span className="text-xs font-bold">Thẻ ATM / Visa Demo</span>
                <span className="text-[10px] text-slate-400">Cổng thanh toán thẻ</span>
              </label>
            </div>

            <div className="p-3 bg-slate-950 border border-slate-800/80 rounded-xl text-[11px] text-slate-400 flex items-start gap-2">
              <Lock className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>
                <strong>Lưu ý kiểm thử:</strong> Đây là môi trường Frontend Demo hoàn toàn an toàn. Không yêu cầu mật khẩu ngân hàng, mã OTP hay trừ tiền trong tài khoản của bạn.
              </span>
            </div>
          </div>
        </div>

        {/* Order Review & Submit (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-slate-900/90 border border-slate-800/80 rounded-2xl p-6 space-y-5 shadow-xl sticky top-28">
            <h2 className="text-base font-bold text-white tracking-tight border-b border-slate-800 pb-3 flex items-center justify-between">
              <span>Đơn Hàng ({totals.itemCount} game)</span>
              <Link href="/cart" className="text-xs text-cyan-400 font-semibold hover:underline">
                Sửa giỏ
              </Link>
            </h2>

            {/* Items list preview */}
            <div className="divide-y divide-slate-800/80 max-h-60 overflow-y-auto pr-1 space-y-3">
              {items.map((item) => (
                <div key={item.game.id} className="pt-3 first:pt-0 flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <img
                      src={item.game.coverImage}
                      alt={item.game.title}
                      className="w-10 h-7 object-cover rounded bg-slate-950 shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="font-semibold text-slate-200 truncate">{item.game.title}</p>
                      <p className="text-[11px] text-slate-400">Số lượng: x{item.quantity}</p>
                    </div>
                  </div>
                  <span className="font-bold text-slate-200 shrink-0">
                    {formatVND(item.game.currentPrice * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            {/* Calculations Breakdown */}
            <div className="border-t border-slate-800/80 pt-3 space-y-2 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Tạm tính tiền hàng:</span>
                <span className="text-slate-200 font-semibold">{formatVND(totals.subtotal)}</span>
              </div>

              {appliedCoupon && totals.discountAmount > 0 && (
                <div className="flex justify-between text-cyan-400">
                  <span>Mã giảm giá ({appliedCoupon.code}):</span>
                  <span className="font-bold">-{formatVND(totals.discountAmount)}</span>
                </div>
              )}

              <div className="flex justify-between text-slate-400">
                <span>Phí giao dịch kỹ thuật số:</span>
                <span className="text-emerald-400 font-bold">Miễn phí (0 ₫)</span>
              </div>

              <div className="flex justify-between text-base font-extrabold text-white pt-2 border-t border-slate-800/80">
                <span>Tổng cộng:</span>
                <span
                  data-testid="checkout-final-total"
                  className="text-xl text-cyan-400 font-black"
                >
                  {formatVND(totals.finalTotal)}
                </span>
              </div>
            </div>

            {/* Submit Place Order Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              data-testid="place-order-button"
              className="w-full py-4 px-6 rounded-xl font-black text-sm bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white shadow-xl shadow-indigo-600/25 transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>{isSubmitting ? 'Đang kích hoạt license...' : 'Xác nhận đặt hàng demo'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
