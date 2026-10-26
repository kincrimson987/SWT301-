'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Heart,
  ShoppingCart,
  Trash2,
  ArrowRight,
  ShoppingBag,
  Sparkles,
} from 'lucide-react';
import { useWishlistStore } from '@/store/useWishlistStore';
import { useCartStore } from '@/store/useCartStore';
import { formatVND } from '@/utils/formatters';
import { useToast } from '@/components/ui/Toast';

export default function WishlistPage() {
  const [mounted, setMounted] = useState(false);
  const { wishlist, removeFromWishlist, moveToCart, clearWishlist } =
    useWishlistStore();
  const addToCart = useCartStore((state) => state.addToCart);
  const { showToast } = useToast();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center text-slate-400">
        Đang tải danh sách yêu thích...
      </div>
    );
  }

  const handleMoveAllToCart = () => {
    let successCount = 0;
    for (const game of wishlist) {
      if (game.inStock) {
        addToCart(game, 1);
        successCount++;
      }
    }
    clearWishlist();
    showToast(
      `Đã chuyển ${successCount} tựa game vào giỏ hàng thành công!`,
      'success'
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full flex flex-col gap-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
            <Heart className="w-8 h-8 text-rose-500 fill-rose-500" />
            Danh Sách Game Yêu Thích
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Lưu lại các trò chơi bạn quan tâm để theo dõi giá và mua sắm dễ dàng
          </p>
        </div>

        {wishlist.length > 0 && (
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleMoveAllToCart}
              data-testid="move-all-to-cart-button"
              className="px-4 py-2.5 rounded-xl font-bold text-xs bg-indigo-600 hover:bg-indigo-500 text-white transition-all flex items-center gap-2 shadow-md shadow-indigo-600/20"
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              <span>Chuyển tất cả vào giỏ</span>
            </button>

            <button
              type="button"
              onClick={() => {
                clearWishlist();
                showToast('Đã xóa toàn bộ danh sách yêu thích.', 'info');
              }}
              data-testid="clear-wishlist-button"
              className="p-2.5 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
              title="Xóa tất cả"
              aria-label="Xóa tất cả yêu thích"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {wishlist.length > 0 ? (
        <div
          data-testid="wishlist-grid"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {wishlist.map((game) => (
            <div
              key={game.id}
              data-testid="wishlist-item-card"
              className="bg-slate-900/90 border border-slate-800/80 rounded-2xl overflow-hidden flex flex-col justify-between shadow-lg hover:border-slate-700 transition-all"
            >
              <div>
                <Link
                  href={`/store/${game.slug}`}
                  className="aspect-[16/10] w-full block overflow-hidden bg-slate-950 relative group"
                >
                  <img
                    src={game.coverImage}
                    alt={game.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {game.isDiscounted && game.discountPercent > 0 && (
                    <span className="absolute top-3 left-3 bg-rose-600 text-white font-extrabold text-[11px] px-2 py-0.5 rounded">
                      -{game.discountPercent}%
                    </span>
                  )}
                </Link>

                <div className="p-4 space-y-2">
                  <span className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider">
                    {game.genre}
                  </span>
                  <Link
                    href={`/store/${game.slug}`}
                    className="block text-sm font-bold text-slate-100 hover:text-cyan-400 line-clamp-1 transition-colors"
                  >
                    {game.title}
                  </Link>

                  <div className="flex items-center gap-2 pt-1">
                    <span className="text-sm font-extrabold text-cyan-400">
                      {formatVND(game.currentPrice)}
                    </span>
                    {game.isDiscounted && game.originalPrice > game.currentPrice && (
                      <span className="text-xs text-slate-400 line-through">
                        {formatVND(game.originalPrice)}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Action buttons footer */}
              <div className="p-4 pt-0 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const res = moveToCart(game);
                    if (res.success) {
                      showToast(res.message, 'success');
                    } else {
                      showToast(res.message, 'error');
                    }
                  }}
                  disabled={!game.inStock}
                  data-testid="wishlist-move-to-cart"
                  className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                    !game.inStock
                      ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                      : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/20'
                  }`}
                >
                  <ShoppingCart className="w-3.5 h-3.5" />
                  <span>{game.inStock ? 'Chuyển vào giỏ' : 'Hết hàng'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    removeFromWishlist(game.id);
                    showToast(`Đã xóa "${game.title}" khỏi yêu thích.`, 'info');
                  }}
                  data-testid="wishlist-remove-item"
                  className="p-2.5 rounded-xl text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                  title="Xóa khỏi yêu thích"
                  aria-label="Xóa"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Empty State */
        <div
          data-testid="empty-wishlist-state"
          className="flex flex-col items-center justify-center py-20 px-4 text-center bg-slate-900/40 rounded-3xl border border-dashed border-slate-800 space-y-5"
        >
          <div className="w-20 h-20 rounded-3xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-center text-rose-500/80 shadow-inner">
            <Heart className="w-10 h-10 fill-current" />
          </div>
          <div className="space-y-1">
            <h2 className="text-2xl font-black text-white">Chưa có trò chơi yêu thích nào</h2>
            <p className="text-xs sm:text-sm text-slate-400 max-w-md">
              Nhấn vào biểu tượng trái tim trên bất kỳ game nào để lưu lại danh sách các tựa game bạn yêu thích nhất tại đây.
            </p>
          </div>

          <Link
            href="/store"
            className="px-6 py-3.5 rounded-xl font-bold text-xs bg-gradient-to-r from-indigo-600 to-cyan-500 text-white shadow-lg shadow-indigo-600/25 hover:scale-105 transition-all flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            Khám phá game ngay
          </Link>
        </div>
      )}
    </div>
  );
}
