'use client';

import React, { useState, useMemo, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  Search,
  SlidersHorizontal,
  RotateCcw,
  Sparkles,
  Check,
  ChevronDown,
  Tag,
  Frown,
} from 'lucide-react';
import { DEMO_GAMES } from '@/data/games';
import { Game, GameGenre } from '@/types/game';
import { GameCard } from '@/components/game/GameCard';
import { matchSearch } from '@/utils/helpers';

const GENRE_OPTIONS: { label: string; value: string }[] = [
  { label: 'Tất cả thể loại', value: 'ALL' },
  { label: 'Action (Hành động)', value: 'Action' },
  { label: 'RPG (Nhập vai)', value: 'RPG' },
  { label: 'Strategy (Chiến thuật)', value: 'Strategy' },
  { label: 'Adventure (Phiêu lưu)', value: 'Adventure' },
  { label: 'Racing (Đua xe)', value: 'Racing' },
  { label: 'Simulation (Mô phỏng)', value: 'Simulation' },
  { label: 'Horror (Kinh dị)', value: 'Horror' },
  { label: 'Indie', value: 'Indie' },
];

const PRICE_RANGES = [
  { label: 'Tất cả mức giá', min: 0, max: Infinity },
  { label: 'Dưới 300.000 ₫', min: 0, max: 300000 },
  { label: '300.000 ₫ - 600.000 ₫', min: 300000, max: 600000 },
  { label: '600.000 ₫ - 1.000.000 ₫', min: 600000, max: 1000000 },
  { label: 'Trên 1.000.000 ₫', min: 1000000, max: Infinity },
];

type SortOption =
  | 'popularity'
  | 'price_asc'
  | 'price_desc'
  | 'name_asc'
  | 'name_desc'
  | 'newest';

function StoreContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // URL query parameters
  const queryParam = searchParams.get('q') || '';
  const genreParam = searchParams.get('genre') || 'ALL';
  const discountParam = searchParams.get('discount') === 'true';
  const sortParam = (searchParams.get('sort') as SortOption) || 'popularity';

  const [search, setSearch] = useState(queryParam);
  const [selectedGenre, setSelectedGenre] = useState<string>(genreParam);
  const [selectedPriceRangeIndex, setSelectedPriceRangeIndex] = useState<number>(0);
  const [onlyDiscounted, setOnlyDiscounted] = useState<boolean>(discountParam);
  const [onlyInStock, setOnlyInStock] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<SortOption>(sortParam);
  const [displayCount, setDisplayCount] = useState<number>(8);

  // Sync state when URL params change
  useEffect(() => {
    if (searchParams.get('q') !== null) {
      setSearch(searchParams.get('q') || '');
    }
    if (searchParams.get('genre')) {
      setSelectedGenre(searchParams.get('genre') || 'ALL');
    }
    if (searchParams.get('discount') === 'true') {
      setOnlyDiscounted(true);
    }
    if (searchParams.get('sort')) {
      setSortBy((searchParams.get('sort') as SortOption) || 'popularity');
    }
  }, [searchParams]);

  // Reset all filters
  const handleResetFilters = () => {
    setSearch('');
    setSelectedGenre('ALL');
    setSelectedPriceRangeIndex(0);
    setOnlyDiscounted(false);
    setOnlyInStock(false);
    setSortBy('popularity');
    setDisplayCount(8);
    router.push('/store');
  };

  // Filter and sort games logic
  const filteredGames = useMemo(() => {
    let result = [...DEMO_GAMES];

    // Search filter with smart accent-insensitive matching
    if (search.trim()) {
      const q = search.trim();
      result = result.filter(
        (g) =>
          matchSearch(g.title, q) ||
          matchSearch(g.genre, q) ||
          matchSearch(g.developer, q) ||
          matchSearch(g.publisher, q) ||
          matchSearch(g.shortDescription, q) ||
          g.tags.some((t) => matchSearch(t, q))
      );
    }

    // Genre filter
    if (selectedGenre !== 'ALL') {
      result = result.filter((g) => g.genre === selectedGenre);
    }

    // Price range filter
    const range = PRICE_RANGES[selectedPriceRangeIndex];
    if (range) {
      result = result.filter(
        (g) => g.currentPrice >= range.min && g.currentPrice <= range.max
      );
    }

    // Only discounted filter
    if (onlyDiscounted) {
      result = result.filter((g) => g.isDiscounted && g.discountPercent > 0);
    }

    // Only in stock filter
    if (onlyInStock) {
      result = result.filter((g) => g.inStock);
    }

    // Sorting
    result.sort((a, b) => {
      switch (sortBy) {
        case 'price_asc':
          return a.currentPrice - b.currentPrice;
        case 'price_desc':
          return b.currentPrice - a.currentPrice;
        case 'name_asc':
          return a.title.localeCompare(b.title);
        case 'name_desc':
          return b.title.localeCompare(a.title);
        case 'newest':
          return new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime();
        case 'popularity':
        default:
          return b.rating * b.reviewCount - a.rating * a.reviewCount;
      }
    });

    return result;
  }, [
    search,
    selectedGenre,
    selectedPriceRangeIndex,
    onlyDiscounted,
    onlyInStock,
    sortBy,
  ]);

  const visibleGames = filteredGames.slice(0, displayCount);
  const hasMore = displayCount < filteredGames.length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex flex-col gap-8">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Cửa Hàng Game PC
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Khám phá kho game bản quyền đa dạng thể loại, cập nhật giá và ưu đãi mới nhất
          </p>
        </div>

        {/* Search input inside store page */}
        <div className="relative w-full md:w-80">
          <input
            type="text"
            placeholder="Tìm theo tên game, từ khóa..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            data-testid="store-search-input"
            className="w-full bg-slate-900 text-sm text-slate-200 placeholder-slate-500 pl-10 pr-4 py-2.5 rounded-xl border border-slate-800 focus:border-cyan-500 outline-none transition-all"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>

      {/* Main Layout: Sidebar Filters + Game Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* SIDEBAR FILTERS */}
        <aside className="lg:col-span-1 flex flex-col gap-6">
          <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-5 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-white font-bold text-sm">
                <SlidersHorizontal className="w-4 h-4 text-cyan-400" />
                <span>Bộ Lọc Game</span>
              </div>
              <button
                type="button"
                onClick={handleResetFilters}
                data-testid="reset-filters-button"
                className="text-xs text-slate-400 hover:text-cyan-400 flex items-center gap-1 transition-colors cursor-pointer"
                aria-label="Đặt lại bộ lọc"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Đặt lại</span>
              </button>
            </div>

            {/* Filter by Genre */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                Thể Loại
              </label>
              <div className="flex flex-col gap-1">
                {GENRE_OPTIONS.map((g) => (
                  <button
                    key={g.value}
                    type="button"
                    onClick={() => setSelectedGenre(g.value)}
                    data-testid={`filter-genre-${g.value}`}
                    className={`flex items-center justify-between text-left px-3 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                      selectedGenre === g.value
                        ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 font-semibold'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                    }`}
                  >
                    <span>{g.label}</span>
                    {selectedGenre === g.value && (
                      <Check className="w-3.5 h-3.5 text-cyan-400" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Filter by Price Range */}
            <div className="space-y-2 border-t border-slate-800/80 pt-4">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                Khoảng Giá
              </label>
              <div className="flex flex-col gap-1">
                {PRICE_RANGES.map((r, idx) => (
                  <button
                    key={r.label}
                    type="button"
                    onClick={() => setSelectedPriceRangeIndex(idx)}
                    data-testid={`filter-price-${idx}`}
                    className={`flex items-center justify-between text-left px-3 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                      selectedPriceRangeIndex === idx
                        ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 font-semibold'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                    }`}
                  >
                    <span>{r.label}</span>
                    {selectedPriceRangeIndex === idx && (
                      <Check className="w-3.5 h-3.5 text-cyan-400" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Checkboxes: Discounted & In Stock */}
            <div className="space-y-3 border-t border-slate-800/80 pt-4">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                Trạng Thái
              </label>

              <label className="flex items-center gap-2.5 text-xs text-slate-300 hover:text-white cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={onlyDiscounted}
                  onChange={(e) => setOnlyDiscounted(e.target.checked)}
                  data-testid="filter-discount-checkbox"
                  className="rounded border-slate-700 text-cyan-500 focus:ring-cyan-500/40 bg-slate-950 w-4 h-4 cursor-pointer"
                />
                <span className="flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-rose-400" />
                  Đang giảm giá
                </span>
              </label>

              <label className="flex items-center gap-2.5 text-xs text-slate-300 hover:text-white cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={onlyInStock}
                  onChange={(e) => setOnlyInStock(e.target.checked)}
                  data-testid="filter-instock-checkbox"
                  className="rounded border-slate-700 text-cyan-500 focus:ring-cyan-500/40 bg-slate-950 w-4 h-4 cursor-pointer"
                />
                <span>Chỉ hiển thị game còn hàng</span>
              </label>
            </div>
          </div>
        </aside>

        {/* GAME LIST CONTENT */}
        <section className="lg:col-span-3 flex flex-col gap-6">
          {/* Controls Bar: Results Count + Sort Dropdown */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/50 p-4 rounded-2xl border border-slate-800/80">
            <div className="text-xs text-slate-400">
              Hiển thị <span data-testid="results-count" className="font-bold text-cyan-400">{filteredGames.length}</span> tựa game
              {search && <span> cho từ khóa &quot;{search}&quot;</span>}
            </div>

            {/* Sort selector */}
            <div className="flex items-center gap-2">
              <label htmlFor="store-sort" className="text-xs text-slate-400 whitespace-nowrap">
                Sắp xếp theo:
              </label>
              <select
                id="store-sort"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                data-testid="store-sort-select"
                className="bg-slate-950 border border-slate-800 text-xs text-slate-200 rounded-xl px-3 py-2 outline-none focus:border-cyan-500 cursor-pointer"
              >
                <option value="popularity">Độ phổ biến & Đánh giá</option>
                <option value="price_asc">Giá: Thấp đến Cao</option>
                <option value="price_desc">Giá: Cao đến Thấp</option>
                <option value="name_asc">Tên game: A - Z</option>
                <option value="name_desc">Tên game: Z - A</option>
                <option value="newest">Mới phát hành</option>
              </select>
            </div>
          </div>

          {/* Games Grid or Empty State */}
          {filteredGames.length > 0 ? (
            <>
              <div
                data-testid="store-game-grid"
                className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6"
              >
                {visibleGames.map((game) => (
                  <GameCard key={game.id} game={game} />
                ))}
              </div>

              {/* Load More Button */}
              {hasMore && (
                <div className="flex justify-center pt-6">
                  <button
                    type="button"
                    onClick={() => setDisplayCount((prev) => prev + 6)}
                    data-testid="load-more-button"
                    className="px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700/80 font-bold text-xs transition-all hover:scale-105 cursor-pointer"
                  >
                    Tải thêm game (+6)
                  </button>
                </div>
              )}
            </>
          ) : (
            /* Empty State */
            <div
              data-testid="empty-store-state"
              className="flex flex-col items-center justify-center p-12 text-center bg-slate-900/40 rounded-2xl border border-dashed border-slate-800"
            >
              <div className="w-16 h-16 rounded-2xl bg-slate-800/60 flex items-center justify-center text-slate-400 mb-4">
                <Frown className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-white">Không tìm thấy tựa game nào phù hợp</h3>
              <p className="text-xs text-slate-400 max-w-md mt-1 mb-6">
                Rất tiếc, không có trò chơi nào khớp với từ khóa tìm kiếm &quot;{search}&quot; hoặc các bộ lọc đã chọn. Hãy thử thay đổi tiêu chí hoặc đặt lại bộ lọc.
              </p>
              <button
                type="button"
                onClick={handleResetFilters}
                data-testid="empty-state-reset-button"
                className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-all cursor-pointer"
              >
                Xóa tất cả bộ lọc
              </button>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default function StorePage() {
  return (
    <Suspense fallback={<div className="max-w-7xl mx-auto p-12 text-center text-slate-400">Đang tải cửa hàng...</div>}>
      <StoreContent />
    </Suspense>
  );
}
