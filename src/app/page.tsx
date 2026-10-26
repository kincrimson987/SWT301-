'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  Flame,
  Tag,
  ArrowRight,
  TrendingUp,
  Clock,
  Shield,
  Gift,
  Gamepad2,
  CheckCircle,
} from 'lucide-react';
import { DEMO_GAMES } from '@/data/games';
import { GameGenre } from '@/types/game';
import { GameCard } from '@/components/game/GameCard';
import { formatVND } from '@/utils/formatters';
import { useCartStore } from '@/store/useCartStore';
import { useToast } from '@/components/ui/Toast';

const GENRES: { label: string; value: GameGenre | 'ALL' }[] = [
  { label: 'Tất cả thể loại', value: 'ALL' },
  { label: 'Hành động', value: 'Action' },
  { label: 'Nhập vai', value: 'RPG' },
  { label: 'Chiến thuật', value: 'Strategy' },
  { label: 'Phiêu lưu', value: 'Adventure' },
  { label: 'Đua xe', value: 'Racing' },
  { label: 'Mô phỏng', value: 'Simulation' },
  { label: 'Kinh dị', value: 'Horror' },
  { label: 'Indie', value: 'Indie' },
];

export default function HomePage() {
  const [selectedGenre, setSelectedGenre] = useState<GameGenre | 'ALL'>('ALL');
  const { showToast } = useToast();
  const addToCart = useCartStore((state) => state.addToCart);

  // Hero game is Cyber Protocol
  const heroGame = DEMO_GAMES[0];

  // Featured games
  const featuredGames = DEMO_GAMES.filter((g) => g.isFeatured).slice(0, 4);

  // Best sellers
  const bestSellers = DEMO_GAMES.filter((g) => g.isBestSeller).slice(0, 4);

  // Discounted games
  const discountedGames = DEMO_GAMES.filter(
    (g) => g.isDiscounted && g.discountPercent >= 30
  ).slice(0, 4);

  // New releases
  const newReleases = DEMO_GAMES.filter((g) => g.isNewRelease || g.releaseDate.startsWith('2025')).slice(0, 4);

  // Filtered games for quick genre section
  const quickFilteredGames =
    selectedGenre === 'ALL'
      ? DEMO_GAMES.slice(0, 8)
      : DEMO_GAMES.filter((g) => g.genre === selectedGenre);

  const handleHeroAddToCart = () => {
    const res = addToCart(heroGame, 1);
    if (res.success) {
      showToast(res.message, 'success');
    } else {
      showToast(res.message, 'error');
    }
  };

  return (
    <div className="flex flex-col gap-16 pb-20">
      {/* 1. HERO BANNER */}
      <section className="relative w-full overflow-hidden border-b border-slate-800/80 bg-slate-950">
        {/* Background glow and image */}
        <div className="absolute inset-0 z-0">
          <img
            src={heroGame.bannerImage}
            alt={heroGame.title}
            className="w-full h-full object-cover object-center opacity-30 blur-[2px] scale-105 transform"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/85 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/60" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-28">
          <div className="max-w-2xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/80 border border-cyan-800/60 text-cyan-300 text-xs font-semibold backdrop-blur-md">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>Đề Xuất Nổi Bật Tuần Này • Giảm Ngay 50%</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.1]">
              <span className="bg-gradient-to-r from-cyan-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
                {heroGame.title}
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
              {heroGame.shortDescription}
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-black text-cyan-400">
                  {formatVND(heroGame.currentPrice)}
                </span>
                <span className="text-lg text-slate-400 line-through">
                  {formatVND(heroGame.originalPrice)}
                </span>
                <span className="bg-rose-600 text-white text-xs font-black px-2 py-0.5 rounded">
                  -{heroGame.discountPercent}%
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 pt-3">
              <Link
                href="/store"
                data-testid="hero-explore-button"
                className="px-6 py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white shadow-xl shadow-indigo-600/25 transition-all hover:scale-105 flex items-center gap-2"
              >
                <Gamepad2 className="w-4 h-4" />
                Khám phá game
              </Link>

              <Link
                href="/store?discount=true"
                data-testid="hero-discount-button"
                className="px-6 py-3.5 rounded-xl font-bold text-sm bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700/80 hover:border-slate-600 transition-all flex items-center gap-2"
              >
                <Tag className="w-4 h-4 text-rose-400" />
                Xem ưu đãi
              </Link>

              <button
                type="button"
                onClick={handleHeroAddToCart}
                data-testid="hero-buy-now-button"
                className="px-6 py-3.5 rounded-xl font-bold text-sm bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-300 border border-indigo-500/40 transition-all"
              >
                Mua ngay bản quyền
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 2. PROMO COUPON BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="rounded-2xl bg-gradient-to-r from-indigo-950/60 via-purple-950/50 to-slate-900 border border-indigo-800/40 p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400 shrink-0">
              <Gift className="w-7 h-7" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">Ưu Đãi Đặc Quyền Demo</span>
              <h2 className="text-xl sm:text-2xl font-bold text-white mt-0.5">Nhập mã giảm giá khi thanh toán</h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Sử dụng mã <code className="bg-indigo-900/60 text-cyan-300 px-2 py-0.5 rounded font-mono font-bold">GAMEHUB10</code> (Giảm 10%) hoặc <code className="bg-indigo-900/60 text-cyan-300 px-2 py-0.5 rounded font-mono font-bold">GAMEHUB50K</code> (Giảm 50.000 ₫ cho đơn từ 300.000 ₫).
              </p>
            </div>
          </div>
          <Link
            href="/store?discount=true"
            className="shrink-0 px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-colors flex items-center gap-2"
          >
            Áp dụng mã ngay
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* 3. GAME NỔI BẬT (FEATURED GAMES) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-2xl font-extrabold text-white tracking-tight">Game Nổi Bật</h2>
              <p className="text-xs text-slate-400">Những tựa game đỉnh cao được cộng đồng GameHub đánh giá cao nhất</p>
            </div>
          </div>
          <Link
            href="/store"
            className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition-colors"
          >
            Xem tất cả
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredGames.map((game) => (
            <GameCard key={game.id} game={game} />
          ))}
        </div>
      </section>

      {/* 4. GAME BÁN CHẠY (BEST SELLERS) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Flame className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-2xl font-extrabold text-white tracking-tight">Game Bán Chạy Nhất</h2>
              <p className="text-xs text-slate-400">Các tựa game liên tục đứng đầu bảng xếp hạng doanh thu tháng</p>
            </div>
          </div>
          <Link
            href="/store?sort=popularity"
            className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition-colors"
          >
            Bảng xếp hạng
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {bestSellers.map((game) => (
            <GameCard key={game.id} game={game} />
          ))}
        </div>
      </section>

      {/* 5. GAME ĐANG GIẢM GIÁ (SPECIAL DISCOUNTS) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400">
              <Tag className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-2xl font-extrabold text-white tracking-tight">Ưu Đãi Giảm Giá Lớn</h2>
              <p className="text-xs text-slate-400">Cơ hội sở hữu siêu phẩm với mức giá ưu đãi từ 30% đến 60%</p>
            </div>
          </div>
          <Link
            href="/store?discount=true"
            className="text-xs font-semibold text-rose-400 hover:text-rose-300 flex items-center gap-1 transition-colors"
          >
            Xem tất cả ưu đãi
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {discountedGames.map((game) => (
            <GameCard key={game.id} game={game} />
          ))}
        </div>
      </section>

      {/* 6. GAME MỚI PHÁT HÀNH (NEW RELEASES) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-2xl font-extrabold text-white tracking-tight">Mới Phát Hành</h2>
              <p className="text-xs text-slate-400">Khám phá các tựa game vừa cập bến GameHub trong thời gian gần đây</p>
            </div>
          </div>
          <Link
            href="/store"
            className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition-colors"
          >
            Xem kho game
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {newReleases.map((game) => (
            <GameCard key={game.id} game={game} />
          ))}
        </div>
      </section>

      {/* 7. BỘ LỌC THỂ LOẠI NHANH (QUICK GENRE FILTER) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-extrabold text-white tracking-tight">Khám Phá Theo Thể Loại</h2>
            <p className="text-xs text-slate-400">Chọn thể loại bạn yêu thích để lọc danh sách game nhanh chóng</p>
          </div>
          {/* Quick genre pill buttons */}
          <div className="flex flex-wrap items-center gap-2">
            {GENRES.map((g) => (
              <button
                key={g.value}
                type="button"
                onClick={() => setSelectedGenre(g.value)}
                data-testid={`quick-genre-${g.value}`}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  selectedGenre === g.value
                    ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                    : 'bg-slate-900 border border-slate-800 text-slate-300 hover:border-slate-700 hover:text-white'
                }`}
              >
                {g.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickFilteredGames.map((game) => (
            <GameCard key={game.id} game={game} />
          ))}
        </div>
      </section>
    </div>
  );
}
