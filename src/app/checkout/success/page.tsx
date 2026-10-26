'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  CheckCircle2,
  Copy,
  Check,
  ShoppingBag,
  PackageCheck,
  ArrowRight,
  ShieldCheck,
  KeyRound,
  Download,
} from 'lucide-react';
import { useOrderStore } from '@/store/useOrderStore';
import { formatVND, formatDate } from '@/utils/formatters';
import { useToast } from '@/components/ui/Toast';

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');
  const { getOrderById, lastCreatedOrder } = useOrderStore();
  const { showToast } = useToast();

  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Retrieve order from store
  const order = orderId ? getOrderById(orderId) || lastCreatedOrder : lastCreatedOrder;

  const handleCopyKey = (key: string) => {
    navigator.clipboard.writeText(key);
    setCopiedKey(key);
    showToast('Đã sao chép License Key vào clipboard!', 'success');
    setTimeout(() => setCopiedKey(null), 2500);
  };

  if (!order) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-white">Không tìm thấy đơn hàng</h2>
        <p className="text-sm text-slate-400">
          Mã đơn hàng không hợp lệ hoặc phiên thanh toán đã kết thúc.
        </p>
        <Link
          href="/store"
          className="inline-block px-6 py-3 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs"
        >
          Quay lại Cửa Hàng
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full space-y-8">
      {/* Celebration Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 items-center justify-center text-emerald-400 shadow-xl shadow-emerald-500/10 animate-in zoom-in">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
          Đặt Hàng Demo Thành Công!
        </h1>
        <p className="text-sm text-slate-300 max-w-lg mx-auto">
          Cảm ơn bạn đã trải nghiệm mua sắm tại GameHub. Toàn bộ mã kích hoạt bản quyền đã sẵn sàng sử dụng dưới đây.
        </p>
      </div>

      {/* Main Order Details Card */}
      <div className="bg-slate-900/90 border border-slate-800/80 rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl">
        {/* Meta summary top row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-slate-950/70 border border-slate-800 text-xs">
          <div>
            <span className="text-slate-400 block font-medium">Mã đơn hàng:</span>
            <span data-testid="order-success-id" className="text-cyan-400 font-mono font-bold text-sm">
              {order.id}
            </span>
          </div>

          <div>
            <span className="text-slate-400 block font-medium">Thời gian tạo:</span>
            <span className="text-slate-200 font-semibold">
              {formatDate(order.createdAt)}
            </span>
          </div>

          <div>
            <span className="text-slate-400 block font-medium">Người nhận key:</span>
            <span className="text-slate-200 font-semibold truncate block">
              {order.customer.fullName}
            </span>
          </div>

          <div>
            <span className="text-slate-400 block font-medium">Trạng thái:</span>
            <span className="text-emerald-400 font-bold flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Đã thanh toán (Demo)
            </span>
          </div>
        </div>

        {/* License Keys Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <KeyRound className="w-5 h-5 text-amber-400" />
            <h2 className="text-base font-bold text-white tracking-tight">
              Mã Bản Quyền Game Kỹ Thuật Số (Digital License Keys)
            </h2>
          </div>

          <div className="space-y-3" data-testid="license-keys-container">
            {order.licenseKeys.map((keyItem, index) => (
              <div
                key={index}
                data-testid="license-key-item"
                className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl bg-slate-950 border border-slate-800/80 gap-3"
              >
                <div>
                  <span className="text-xs text-slate-400 block">Tựa game:</span>
                  <span className="text-sm font-bold text-white">
                    {keyItem.gameTitle}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    data-testid="license-key-code"
                    className="font-mono text-sm font-bold text-cyan-300 tracking-wider bg-cyan-950/50 border border-cyan-800/50 px-3 py-1.5 rounded-lg select-all"
                  >
                    {keyItem.licenseKey}
                  </span>

                  <button
                    type="button"
                    onClick={() => handleCopyKey(keyItem.licenseKey)}
                    data-testid="copy-key-button"
                    className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition-colors shrink-0"
                    title="Sao chép License Key"
                    aria-label="Sao chép mã bản quyền"
                  >
                    {copiedKey === keyItem.licenseKey ? (
                      <Check className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Items Table */}
        <div className="space-y-3 border-t border-slate-800 pt-5">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            Chi Tiết Sản Phẩm Đã Mua
          </h3>

          <div className="divide-y divide-slate-800/80 text-xs">
            {order.items.map((item) => (
              <div key={item.game.id} className="py-3 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <img
                    src={item.game.coverImage}
                    alt={item.game.title}
                    className="w-12 h-8 object-cover rounded bg-slate-950"
                  />
                  <div>
                    <span className="font-semibold text-slate-200 block">{item.game.title}</span>
                    <span className="text-slate-400">Số lượng: x{item.quantity}</span>
                  </div>
                </div>
                <span className="font-bold text-slate-200">
                  {formatVND(item.game.currentPrice * item.quantity)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Financial Summary */}
        <div className="border-t border-slate-800 pt-4 space-y-2 text-xs">
          <div className="flex justify-between text-slate-400">
            <span>Tạm tính tiền hàng:</span>
            <span>{formatVND(order.subtotal)}</span>
          </div>

          {order.appliedCoupon && (
            <div className="flex justify-between text-cyan-400">
              <span>Mã ưu đãi ({order.appliedCoupon.code}):</span>
              <span className="font-bold">-{formatVND(order.discountAmount)}</span>
            </div>
          )}

          <div className="flex justify-between text-base font-extrabold text-white pt-2 border-t border-slate-800">
            <span>Tổng thanh toán đã xác nhận:</span>
            <span
              data-testid="order-success-total"
              className="text-xl text-cyan-400 font-black"
            >
              {formatVND(order.finalTotal)}
            </span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-4">
        <Link
          href="/store"
          data-testid="success-continue-shopping"
          className="px-6 py-3.5 rounded-xl font-bold text-xs bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white shadow-lg shadow-indigo-600/25 transition-all flex items-center gap-2"
        >
          <ShoppingBag className="w-4 h-4" />
          Tiếp tục mua sắm
        </Link>

        <Link
          href="/orders"
          data-testid="success-view-orders"
          className="px-6 py-3.5 rounded-xl font-bold text-xs bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 transition-all flex items-center gap-2"
        >
          <PackageCheck className="w-4 h-4 text-cyan-400" />
          Xem lịch sử đơn hàng
        </Link>
      </div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={<div className="max-w-4xl mx-auto p-12 text-center text-slate-400">Đang tải thông tin đơn hàng...</div>}>
      <OrderSuccessContent />
    </Suspense>
  );
}
