'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ShoppingCart,
  Heart,
  Star,
  Cpu,
  Sparkles,
  Plus,
  Minus,
} from 'lucide-react';
import { Game } from '@/types/game';
import { DEMO_GAMES } from '@/data/games';
import { formatVND, formatDate } from '@/utils/formatters';
import { useCartStore } from '@/store/useCartStore';
import { useWishlistStore } from '@/store/useWishlistStore';
import { useToast } from '@/components/ui/Toast';
import { GameCard } from '@/components/game/GameCard';

interface GameDetailClientProps {
  game: Game;
}

export function GameDetailClient({ game }: GameDetailClientProps) {
  const { showToast } = useToast();

  const [selectedImage, setSelectedImage] = useState<string>(
    game.bannerImage || game.coverImage
  );
  const [quantity, setQuantity] = useState<number>(1);

  const addToCart = useCartStore((state) => state.addToCart);
  const { toggleWishlist, isInWishlist } = useWishlistStore();
  const isFavorited = isInWishlist(game.id);

  // Related games (same genre or featured, excluding current game)
  const relatedGames = DEMO_GAMES.filter(
    (g) => g.id !== game.id && (g.genre === game.genre || g.isFeatured)
  ).slice(0, 4);

  const handleAddToCart = () => {
    if (!game.inStock) {
      showToast(`Sản phẩm "${game.title}" hiện đã hết hàng!`, 'error');
      return;
    }

    const res = addToCart(game, quantity);
    if (res.success) {
      showToast(res.message, 'success');
    } else {
      showToast(res.message, 'error');
    }
  };

  const handleToggleWishlist = () => {
    const nowFavorited = toggleWishlist(game);
    if (nowFavorited) {
      showToast(`Đã thêm "${game.title}" vào danh sách yêu thích!`, 'success');
    } else {
      showToast(`Đã xóa "${game.title}" khỏi danh sách yêu thích.`, 'info');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex flex-col gap-12">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-slate-400">
        <Link href="/" className="hover:text-cyan-400 transition-colors">
          Trang chủ
        </Link>
        <span>/</span>
        <Link href="/store" className="hover:text-cyan-400 transition-colors">
          Cửa hàng
        </Link>
        <span>/</span>
        <span className="text-slate-200 truncate">{game.title}</span>
      </nav>

      {/* Main Top Section: Gallery (Left) + Purchase Card (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Media Gallery (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          {/* Main Selected Image */}
          <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shadow-2xl">
            <img
              src={selectedImage}
              alt={game.title}
              className="w-full h-full object-cover object-center"
            />
            {game.isDiscounted && game.discountPercent > 0 && (
              <span className="absolute top-4 left-4 bg-rose-600 text-white font-extrabold text-sm px-3 py-1.5 rounded-lg shadow-lg">
                -{game.discountPercent}%
              </span>
            )}
          </div>

          {/* Thumbnails row */}
          <div className="flex items-center gap-3 overflow-x-auto pb-2">
            {[game.bannerImage, ...(game.screenshots || [])].map((img, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setSelectedImage(img)}
                className={`relative aspect-[16/9] w-24 shrink-0 rounded-xl overflow-hidden border-2 transition-all ${
                  selectedImage === img
                    ? 'border-cyan-400 scale-105 shadow-md shadow-cyan-500/20'
                    : 'border-slate-800 hover:border-slate-700 opacity-70 hover:opacity-100'
                }`}
              >
                <img
                  src={img}
                  alt={`Screenshot ${idx + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Purchase & Key Info Details (5 cols) */}
        <div className="lg:col-span-5 flex flex-col justify-between bg-slate-900/80 border border-slate-800/80 rounded-2xl p-6 sm:p-8 shadow-xl">
          <div className="space-y-5">
            {/* Genre & Stock Badge */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider bg-cyan-950/60 border border-cyan-800/50 px-2.5 py-1 rounded-md">
                {game.genre}
              </span>

              <span
                data-testid="detail-stock-status"
                className={`text-xs font-semibold px-2.5 py-1 rounded-md flex items-center gap-1.5 ${
                  game.inStock
                    ? 'bg-emerald-950/60 border border-emerald-800/50 text-emerald-300'
                    : 'bg-amber-950/60 border border-amber-800/50 text-amber-300'
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    game.inStock ? 'bg-emerald-400' : 'bg-amber-400'
                  }`}
                />
                {game.inStock ? 'Còn hàng trong kho' : 'Tạm hết hàng'}
              </span>
            </div>

            {/* Title */}
            <h1
              data-testid="detail-game-title"
              className="text-2xl sm:text-3xl font-black text-white tracking-tight"
            >
              {game.title}
            </h1>

            {/* Rating & Reviews */}
            <div className="flex items-center gap-3 text-xs">
              <div className="flex items-center gap-1 text-amber-400 font-bold bg-amber-950/40 border border-amber-800/40 px-2 py-1 rounded-lg">
                <Star className="w-4 h-4 fill-amber-400" />
                <span data-testid="detail-rating">{game.rating.toFixed(1)} / 5.0</span>
              </div>
              <span className="text-slate-400">
                ({game.reviewCount.toLocaleString('vi-VN')} lượt đánh giá tích cực)
              </span>
            </div>

            {/* Short description */}
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {game.shortDescription}
            </p>

            {/* Price section */}
            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800/80 flex items-center justify-between">
              <div>
                <span className="text-[11px] text-slate-400 block font-medium">Giá bán chính thức</span>
                <div className="flex items-baseline gap-2.5 mt-0.5">
                  <span
                    data-testid="detail-current-price"
                    className="text-2xl font-black text-cyan-400 tracking-tight"
                  >
                    {formatVND(game.currentPrice)}
                  </span>
                  {game.isDiscounted && game.originalPrice > game.currentPrice && (
                    <span
                      data-testid="detail-original-price"
                      className="text-xs text-slate-400 line-through"
                    >
                      {formatVND(game.originalPrice)}
                    </span>
                  )}
                </div>
              </div>

              {game.isDiscounted && game.discountPercent > 0 && (
                <div className="bg-rose-600/20 border border-rose-500/40 text-rose-300 font-bold text-xs px-2.5 py-1 rounded-lg">
                  Tiết kiệm {game.discountPercent}%
                </div>
              )}
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-slate-300 font-semibold">Số lượng mua:</span>
              <div className="flex items-center bg-slate-950 border border-slate-800 rounded-xl overflow-hidden">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  data-testid="decrease-quantity-button"
                  className="p-2 text-slate-400 hover:text-white transition-colors"
                  aria-label="Giảm số lượng"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span
                  data-testid="quantity-display"
                  className="w-10 text-center font-bold text-sm text-white"
                >
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => q + 1)}
                  data-testid="increase-quantity-button"
                  className="p-2 text-slate-400 hover:text-white transition-colors"
                  aria-label="Tăng số lượng"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="pt-6 space-y-3">
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={!game.inStock}
              data-testid="detail-add-to-cart-button"
              className={`w-full py-3.5 px-6 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-lg ${
                !game.inStock
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                  : 'bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white shadow-indigo-600/25 active:scale-[0.98]'
              }`}
            >
              <ShoppingCart className="w-4 h-4" />
              <span>{game.inStock ? 'Thêm vào giỏ hàng' : 'Sản phẩm tạm hết hàng'}</span>
            </button>

            <button
              type="button"
              onClick={handleToggleWishlist}
              data-testid="detail-wishlist-button"
              className={`w-full py-3 px-6 rounded-xl font-semibold text-xs flex items-center justify-center gap-2 border transition-all ${
                isFavorited
                  ? 'bg-rose-950/40 border-rose-600/50 text-rose-300'
                  : 'bg-slate-950 border-slate-800 text-slate-300 hover:text-white hover:border-slate-700'
              }`}
            >
              <Heart
                className={`w-4 h-4 ${isFavorited ? 'fill-rose-500 text-rose-500' : ''}`}
              />
              <span>
                {isFavorited ? 'Đã thêm vào yêu thích' : 'Thêm vào danh sách yêu thích'}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Details Section: Description + Specs + Reviews */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Description & System Requirements (8 cols) */}
        <div className="lg:col-span-8 space-y-8">
          <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 sm:p-8 space-y-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-cyan-400" />
              Giới Thiệu Trò Chơi
            </h2>
            <div className="text-sm text-slate-300 leading-relaxed space-y-3">
              <p>{game.description}</p>
              <p>
                Trò chơi cung cấp khả năng lưu tiến trình trên đám mây, hỗ trợ toàn diện tay cầm Xbox, PlayStation và tương thích hoàn hảo với màn hình độ phân giải siêu nét 4K 144Hz.
              </p>
            </div>

            <div className="pt-4 border-t border-slate-800/80 flex flex-wrap items-center gap-2">
              <span className="text-xs text-slate-400 mr-2">Tags:</span>
              {game.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs bg-slate-950 border border-slate-800 text-slate-300 px-3 py-1 rounded-lg"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* System Requirements */}
          <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 sm:p-8 space-y-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Cpu className="w-5 h-5 text-indigo-400" />
              Yêu Cầu Cấu Hình Hệ Thống PC
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-4 space-y-2.5">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block">
                  Cấu Hình Tối Thiểu
                </span>
                <ul className="text-xs space-y-1.5 text-slate-300">
                  <li>
                    <strong className="text-slate-400">HĐH:</strong>{' '}
                    {game.systemRequirements.minimum.os}
                  </li>
                  <li>
                    <strong className="text-slate-400">Bộ xử lý:</strong>{' '}
                    {game.systemRequirements.minimum.processor}
                  </li>
                  <li>
                    <strong className="text-slate-400">Bộ nhớ:</strong>{' '}
                    {game.systemRequirements.minimum.memory}
                  </li>
                  <li>
                    <strong className="text-slate-400">Đồ họa:</strong>{' '}
                    {game.systemRequirements.minimum.graphics}
                  </li>
                  <li>
                    <strong className="text-slate-400">Lưu trữ:</strong>{' '}
                    {game.systemRequirements.minimum.storage}
                  </li>
                </ul>
              </div>

              <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-4 space-y-2.5">
                <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider block">
                  Cấu Hình Đề Nghị (Khuyên Dùng)
                </span>
                <ul className="text-xs space-y-1.5 text-slate-300">
                  <li>
                    <strong className="text-slate-400">HĐH:</strong>{' '}
                    {game.systemRequirements.recommended.os}
                  </li>
                  <li>
                    <strong className="text-slate-400">Bộ xử lý:</strong>{' '}
                    {game.systemRequirements.recommended.processor}
                  </li>
                  <li>
                    <strong className="text-slate-400">Bộ nhớ:</strong>{' '}
                    {game.systemRequirements.recommended.memory}
                  </li>
                  <li>
                    <strong className="text-slate-400">Đồ họa:</strong>{' '}
                    {game.systemRequirements.recommended.graphics}
                  </li>
                  <li>
                    <strong className="text-slate-400">Lưu trữ:</strong>{' '}
                    {game.systemRequirements.recommended.storage}
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Metadata details & Reviews (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Thông Tin Chi Tiết
            </h3>
            <div className="divide-y divide-slate-800/80 text-xs">
              <div className="py-2.5 flex justify-between">
                <span className="text-slate-400">Nhà phát triển:</span>
                <span className="text-slate-200 font-semibold">{game.developer}</span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-slate-400">Nhà phát hành:</span>
                <span className="text-slate-200 font-semibold">{game.publisher}</span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-slate-400">Ngày phát hành:</span>
                <span className="text-slate-200 font-semibold">
                  {formatDate(game.releaseDate)}
                </span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-slate-400">Nền tảng:</span>
                <span className="text-slate-200 font-semibold">
                  {game.platforms.join(', ')}
                </span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-slate-400">Hình thức kích hoạt:</span>
                <span className="text-cyan-400 font-semibold">Key kỹ thuật số</span>
              </div>
              {game.steamAppId && (
                <div className="py-2.5 flex justify-between">
                  <span className="text-slate-400">Steam App ID:</span>
                  <span className="text-cyan-300 font-mono font-bold">{game.steamAppId}</span>
                </div>
              )}
              {game.steamUrl && (
                <div className="py-2.5 flex justify-between items-center">
                  <span className="text-slate-400">Trang Steam Store:</span>
                  <a
                    href={game.steamUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-cyan-400 hover:text-cyan-300 font-medium underline inline-flex items-center gap-1 text-[11px]"
                  >
                    Xem trên Steam ↗
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* User Reviews */}
          <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center justify-between">
              <span>Đánh Giá Từ Game Thủ</span>
              <span className="text-amber-400 flex items-center gap-1 font-bold">
                <Star className="w-3.5 h-3.5 fill-amber-400" />
                {game.rating.toFixed(1)}
              </span>
            </h3>

            <div className="space-y-3">
              {(game.reviews && game.reviews.length > 0
                ? game.reviews
                : [
                    {
                      id: 'def-1',
                      author: 'GamePassVN',
                      rating: 5,
                      date: '2025-08-15',
                      comment: 'Game cực kỳ đỉnh, hiệu năng tối ưu tốt và gameplay cuốn hút!',
                    },
                    {
                      id: 'def-2',
                      author: 'ProGamer_HCM',
                      rating: 4.8,
                      date: '2025-09-02',
                      comment: 'Key nhận ngay trong 3 giây sau khi thanh toán. Dịch vụ GameHub rất uy tín.',
                    },
                  ]
              ).map((rev) => (
                <div
                  key={rev.id}
                  className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3.5 space-y-1.5"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-200">{rev.author}</span>
                    <span className="text-slate-500">{formatDate(rev.date)}</span>
                  </div>
                  <div className="flex items-center gap-0.5 text-amber-400">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3 h-3 ${
                          i < Math.floor(rev.rating)
                            ? 'fill-amber-400'
                            : 'text-slate-600'
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-slate-300 leading-normal">{rev.comment}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Related Games */}
      {relatedGames.length > 0 && (
        <section className="space-y-6 pt-4 border-t border-slate-800/80">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">Trò Chơi Liên Quan Cùng Thể Loại</h2>
            <Link
              href={`/store?genre=${game.genre}`}
              className="text-xs font-semibold text-cyan-400 hover:text-cyan-300"
            >
              Xem thêm thể loại {game.genre}
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedGames.map((rg) => (
              <GameCard key={rg.id} game={rg} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
