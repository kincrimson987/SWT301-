'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingCart, Heart, Star, Check, AlertCircle } from 'lucide-react';
import { Game } from '@/types/game';
import { formatVND } from '@/utils/formatters';
import { useCartStore } from '@/store/useCartStore';
import { useWishlistStore } from '@/store/useWishlistStore';
import { useToast } from '@/components/ui/Toast';

interface GameCardProps {
  game: Game;
}

export function GameCard({ game }: GameCardProps) {
  const { showToast } = useToast();
  const addToCart = useCartStore((state) => state.addToCart);
  const { toggleWishlist, isInWishlist } = useWishlistStore();

  const isFavorited = isInWishlist(game.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!game.inStock) {
      showToast(`Sản phẩm "${game.title}" hiện đã hết hàng!`, 'error');
      return;
    }

    const res = addToCart(game, 1);
    if (res.success) {
      showToast(res.message, 'success');
    } else {
      showToast(res.message, 'error');
    }
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const nowFavorited = toggleWishlist(game);
    if (nowFavorited) {
      showToast(`Đã thêm "${game.title}" vào danh sách yêu thích!`, 'success');
    } else {
      showToast(`Đã xóa "${game.title}" khỏi danh sách yêu thích.`, 'info');
    }
  };

  return (
    <div
      data-testid="game-card"
      data-game-id={game.id}
      data-game-slug={game.slug}
      className="group relative flex flex-col rounded-2xl bg-slate-900/90 border border-slate-800/80 hover:border-indigo-500/50 shadow-lg hover:shadow-indigo-500/10 transition-all duration-300 overflow-hidden"
    >
      {/* Thumbnail Container */}
      <Link
        href={`/store/${game.slug}`}
        className="relative aspect-[16/10] w-full overflow-hidden bg-slate-950 block"
        data-testid="game-card-link"
      >
        <img
          src={game.coverImage}
          alt={game.title}
          loading="lazy"
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-80" />

        {/* Badges top left */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {game.isDiscounted && game.discountPercent > 0 && (
            <span
              data-testid="discount-badge"
              className="bg-rose-600 text-white text-xs font-black px-2.5 py-1 rounded-md shadow-md tracking-wider uppercase"
            >
              -{game.discountPercent}%
            </span>
          )}
          {!game.inStock && (
            <span
              data-testid="out-of-stock-badge"
              className="bg-amber-600 text-white text-[11px] font-bold px-2 py-0.5 rounded shadow"
            >
              Hết hàng
            </span>
          )}
          {game.isNewRelease && (
            <span className="bg-cyan-600 text-white text-[11px] font-bold px-2 py-0.5 rounded shadow">
              MỚI
            </span>
          )}
        </div>

        {/* Wishlist toggle top right */}
        <button
          type="button"
          onClick={handleToggleWishlist}
          data-testid="wishlist-toggle-button"
          aria-label={isFavorited ? 'Xóa khỏi yêu thích' : 'Thêm vào yêu thích'}
          className={`absolute top-3 right-3 p-2 rounded-xl backdrop-blur-md transition-all duration-200 z-10 ${
            isFavorited
              ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/30'
              : 'bg-slate-950/70 text-slate-300 hover:text-rose-400 hover:bg-slate-900'
          }`}
        >
          <Heart
            className={`w-4 h-4 ${isFavorited ? 'fill-current' : ''}`}
          />
        </button>

        {/* Platforms bottom right */}
        <div className="absolute bottom-2.5 right-3 text-[11px] font-medium text-slate-300 bg-slate-950/75 px-2 py-0.5 rounded backdrop-blur-sm border border-slate-800/60">
          {game.platforms.join(' • ')}
        </div>
      </Link>

      {/* Content */}
      <div className="flex flex-col flex-1 p-4 sm:p-5 justify-between gap-4">
        <div>
          {/* Genre & Rating */}
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="text-cyan-400 font-semibold uppercase tracking-wider text-[11px]">
              {game.genre}
            </span>
            <div className="flex items-center gap-1 text-amber-400 font-bold">
              <Star className="w-3.5 h-3.5 fill-amber-400" />
              <span>{game.rating.toFixed(1)}</span>
              <span className="text-slate-500 font-normal text-[11px]">
                ({game.reviewCount})
              </span>
            </div>
          </div>

          {/* Title */}
          <Link
            href={`/store/${game.slug}`}
            className="hover:text-cyan-400 transition-colors"
          >
            <h3
              data-testid="game-title"
              className="text-base font-bold text-slate-100 line-clamp-1 group-hover:text-cyan-300 transition-colors"
              title={game.title}
            >
              {game.title}
            </h3>
          </Link>

          {/* Short description */}
          <p className="text-xs text-slate-400 line-clamp-2 mt-1.5 leading-relaxed">
            {game.shortDescription}
          </p>
        </div>

        {/* Pricing and Action */}
        <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
          {/* Price */}
          <div className="flex flex-col">
            {game.isDiscounted && game.originalPrice > game.currentPrice ? (
              <span
                data-testid="game-original-price"
                className="text-[11px] text-slate-400 line-through font-medium"
              >
                {formatVND(game.originalPrice)}
              </span>
            ) : null}
            <span
              data-testid="game-current-price"
              className="text-base font-extrabold text-cyan-400 tracking-tight"
            >
              {formatVND(game.currentPrice)}
            </span>
          </div>

          {/* Add to Cart Button */}
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={!game.inStock}
            data-testid="add-to-cart-button"
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-sm ${
              !game.inStock
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed opacity-60'
                : 'bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white shadow-indigo-600/20 hover:shadow-indigo-500/40'
            }`}
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            <span>{game.inStock ? 'Thêm vào giỏ' : 'Hết hàng'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
