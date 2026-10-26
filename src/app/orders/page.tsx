'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  PackageCheck,
  KeyRound,
  Copy,
  Check,
  ShoppingBag,
  Clock,
  ArrowRight,
} from 'lucide-react';
import { useOrderStore } from '@/store/useOrderStore';
import { formatVND, formatDate } from '@/utils/formatters';
import { useToast } from '@/components/ui/Toast';

export default function OrdersPage() {
  const [mounted, setMounted] = useState(false);
  const { orders } = useOrderStore();
  const { showToast } = useToast();
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleCopyKey = (key: string) => {
    navigator.clipboard.writeText(key);
    setCopiedKey(key);
    showToast('Đã sao chép License Key vào clipboard!', 'success');
    setTimeout(() => setCopiedKey(null), 2500);
  };

  if (!mounted) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center text-slate-400">
        Đang tải lịch sử đơn hàng...
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full flex flex-col gap-8">
      <div className="border-b border-slate-800/80 pb-6">
        <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
          <PackageCheck className="w-8 h-8 text-cyan-400" />
          Lịch Sử Đơn Hàng & Kho Key Kỹ Thuật Số
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Quản lý các bản quyền game PC đã mua trong môi trường thử nghiệm
        </p>
      </div>

      {orders.length > 0 ? (
        <div className="space-y-6" data-testid="orders-list">
          {orders.map((order) => (
            <div
              key={order.id}
              data-testid="order-card"
              className="bg-slate-900/90 border border-slate-800/80 rounded-2xl p-6 space-y-5 shadow-xl"
            >
              {/* Order header row */}
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-cyan-950/60 border border-cyan-800/50 flex items-center justify-center text-cyan-400 font-bold">
                    GH
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 block">Mã đơn hàng</span>
                    <span
                      data-testid="order-id-display"
                      className="text-base font-black text-cyan-300 font-mono"
                    >
                      {order.id}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-6 text-xs">
                  <div>
                    <span className="text-slate-400 block">Ngày đặt</span>
                    <span className="text-slate-200 font-semibold">
                      {formatDate(order.createdAt)}
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-400 block">Tổng tiền</span>
                    <span className="text-base font-black text-white">
                      {formatVND(order.finalTotal)}
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-400 block">Trạng thái</span>
                    <span className="text-emerald-400 font-bold">Đã kích hoạt</span>
                  </div>
                </div>
              </div>

              {/* Items Purchased */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Trò chơi đã mua
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {order.items.map((item) => (
                    <div
                      key={item.game.id}
                      className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center gap-3"
                    >
                      <img
                        src={item.game.coverImage}
                        alt={item.game.title}
                        className="w-12 h-8 object-cover rounded bg-slate-950 shrink-0"
                      />
                      <div className="min-w-0">
                        <Link
                          href={`/store/${item.game.slug}`}
                          className="font-bold text-xs text-slate-200 hover:text-cyan-400 truncate block"
                        >
                          {item.game.title}
                        </Link>
                        <span className="text-[11px] text-slate-400">
                          SL: x{item.quantity} • {formatVND(item.game.currentPrice)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* License Keys */}
              <div className="space-y-2 pt-2 border-t border-slate-800/80">
                <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400">
                  <KeyRound className="w-3.5 h-3.5" />
                  <span>Key kích hoạt bản quyền</span>
                </div>

                <div className="space-y-2">
                  {order.licenseKeys.map((keyItem, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs"
                    >
                      <span className="text-slate-300 font-medium truncate max-w-xs">
                        {keyItem.gameTitle}
                      </span>

                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-cyan-300 bg-cyan-950/40 px-2 py-0.5 rounded border border-cyan-900/40 select-all">
                          {keyItem.licenseKey}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleCopyKey(keyItem.licenseKey)}
                          className="p-1 rounded text-slate-400 hover:text-white"
                          title="Sao chép"
                        >
                          {copiedKey === keyItem.licenseKey ? (
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 px-4 text-center bg-slate-900/40 rounded-3xl border border-dashed border-slate-800 space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-slate-800/80 flex items-center justify-center text-slate-400">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-white">Bạn chưa có đơn hàng nào</h2>
          <p className="text-xs text-slate-400 max-w-sm">
            Sau khi đặt hàng thành công tại GameHub, các đơn hàng và mã kích hoạt game sẽ được hiển thị đầy đủ tại đây.
          </p>
          <Link
            href="/store"
            className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-all"
          >
            Mua sắm ngay
          </Link>
        </div>
      )}
    </div>
  );
}
