'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Gamepad2,
  Search,
  ShoppingCart,
  Heart,
  User,
  LogOut,
  PackageCheck,
  Menu,
  X,
  Sparkles,
  Tag,
} from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import { useWishlistStore } from '@/store/useWishlistStore';
import { useAuthStore } from '@/store/useAuthStore';
import { useToast } from '@/components/ui/Toast';

export function Header() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { showToast } = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  const cartItems = useCartStore((state) => state.items);
  const wishlist = useWishlistStore((state) => state.wishlist);
  const { currentUser, logout } = useAuthStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  const totalCartCount = mounted
    ? cartItems.reduce((acc, item) => acc + item.quantity, 0)
    : 0;
  const totalWishlistCount = mounted ? wishlist.length : 0;

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/store?q=${encodeURIComponent(searchQuery.trim())}`);
      setMobileMenuOpen(false);
    } else {
      router.push('/store');
    }
  };

  const handleLogout = () => {
    logout();
    setUserDropdownOpen(false);
    showToast('Bạn đã đăng xuất thành công.', 'info');
    router.push('/');
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/85 backdrop-blur-md transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-3 group shrink-0"
            data-testid="header-logo"
          >
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 p-[1.5px] shadow-lg shadow-indigo-500/25 group-hover:shadow-cyan-500/30 transition-all">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Gamepad2 className="w-6 h-6 text-cyan-400 group-hover:scale-110 transition-transform" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-white via-slate-100 to-cyan-300 bg-clip-text text-transparent">
                Game<span className="text-cyan-400">Hub</span>
              </span>
              <span className="text-[10px] tracking-wider uppercase font-semibold text-slate-400 -mt-1">
                PC Digital Store
              </span>
            </div>
          </Link>

          {/* Navigation Links (Desktop) */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            <Link
              href="/"
              data-testid="nav-home"
              className="px-3 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/60 transition-colors"
            >
              Trang chủ
            </Link>
            <Link
              href="/store"
              data-testid="nav-store"
              className="px-3 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/60 transition-colors"
            >
              Cửa hàng
            </Link>
            <Link
              href="/store?discount=true"
              data-testid="nav-discount"
              className="px-3 py-2 rounded-lg text-sm font-medium text-rose-300 hover:text-rose-200 hover:bg-rose-950/30 flex items-center gap-1.5 transition-colors"
            >
              <Tag className="w-4 h-4 text-rose-400" />
              Game giảm giá
            </Link>
          </nav>

          {/* Search bar */}
          <form
            onSubmit={handleSearchSubmit}
            className="hidden sm:flex items-center flex-1 max-w-xs md:max-w-sm lg:max-w-md relative"
          >
            <input
              type="text"
              name="search"
              placeholder="Tìm kiếm game, thể loại..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              data-testid="header-search-input"
              className="w-full bg-slate-900/90 text-sm text-slate-200 placeholder-slate-500 pl-10 pr-4 py-2.5 rounded-xl border border-slate-800 focus:border-cyan-500/80 focus:ring-1 focus:ring-cyan-500/80 outline-none transition-all"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <button
              type="submit"
              className="sr-only"
              aria-label="Tìm kiếm"
            >
              Tìm kiếm
            </button>
          </form>

          {/* Action Icons (Desktop & Mobile) */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Wishlist Button */}
            <Link
              href="/wishlist"
              data-testid="header-wishlist-button"
              className="relative p-2.5 rounded-xl text-slate-300 hover:text-rose-400 hover:bg-slate-800/60 transition-colors"
              aria-label="Danh sách yêu thích"
            >
              <Heart className="w-5 h-5" />
              {totalWishlistCount > 0 && (
                <span
                  data-testid="wishlist-badge"
                  className="absolute -top-1 -right-1 bg-rose-600 text-white text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center ring-2 ring-slate-950 animate-in zoom-in"
                >
                  {totalWishlistCount}
                </span>
              )}
            </Link>

            {/* Cart Button */}
            <Link
              href="/cart"
              data-testid="header-cart-button"
              className="relative p-2.5 rounded-xl text-slate-300 hover:text-cyan-400 hover:bg-slate-800/60 transition-colors"
              aria-label="Giỏ hàng"
            >
              <ShoppingCart className="w-5 h-5" />
              {totalCartCount > 0 && (
                <span
                  data-testid="cart-badge"
                  className="absolute -top-1 -right-1 bg-cyan-500 text-slate-950 text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center ring-2 ring-slate-950 animate-in zoom-in"
                >
                  {totalCartCount}
                </span>
              )}
            </Link>

            {/* User Account / Login */}
            {mounted && currentUser ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  data-testid="user-menu-button"
                  className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors text-slate-200"
                >
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-xs font-bold text-white">
                    {currentUser.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden sm:inline-block text-xs font-medium max-w-[100px] truncate">
                    {currentUser.name}
                  </span>
                </button>

                {/* Dropdown Menu */}
                {userDropdownOpen && (
                  <div
                    data-testid="user-dropdown"
                    className="absolute right-0 mt-2 w-56 rounded-xl bg-slate-900 border border-slate-800 shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95"
                  >
                    <div className="px-3 py-2 border-b border-slate-800/80 mb-1">
                      <p className="text-xs text-slate-400">Đã đăng nhập với</p>
                      <p className="text-sm font-semibold text-slate-200 truncate">
                        {currentUser.name}
                      </p>
                      <p className="text-xs text-cyan-400 font-mono truncate">
                        {currentUser.email}
                      </p>
                    </div>

                    <Link
                      href="/orders"
                      data-testid="dropdown-orders-link"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800/80 transition-colors"
                    >
                      <PackageCheck className="w-4 h-4 text-cyan-400" />
                      Lịch sử đơn hàng demo
                    </Link>

                    <button
                      type="button"
                      onClick={handleLogout}
                      data-testid="logout-button"
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-rose-400 hover:text-rose-300 hover:bg-rose-950/30 transition-colors mt-1"
                    >
                      <LogOut className="w-4 h-4" />
                      Đăng xuất
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/login"
                data-testid="header-login-button"
                className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white shadow-md shadow-indigo-600/20 transition-all hover:scale-[1.02]"
              >
                <User className="w-3.5 h-3.5" />
                Đăng nhập
              </Link>
            )}

            {/* Mobile Hamburger Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              data-testid="mobile-menu-toggle"
              className="md:hidden p-2.5 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
              aria-label="Menu"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div
          data-testid="mobile-drawer"
          className="md:hidden border-t border-slate-800/80 bg-slate-950/95 backdrop-blur-xl px-4 pt-3 pb-6 space-y-3 animate-in slide-in-from-top duration-200"
        >
          {/* Mobile Search */}
          <form onSubmit={handleSearchSubmit} className="relative w-full">
            <input
              type="text"
              placeholder="Tìm kiếm game..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900 text-sm text-slate-200 placeholder-slate-500 pl-10 pr-4 py-2.5 rounded-xl border border-slate-800 focus:border-cyan-500 outline-none"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          </form>

          <div className="flex flex-col gap-1 pt-2">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2.5 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800"
            >
              Trang chủ
            </Link>
            <Link
              href="/store"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2.5 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800"
            >
              Cửa hàng
            </Link>
            <Link
              href="/store?discount=true"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2.5 rounded-lg text-sm font-medium text-rose-300 hover:bg-rose-950/30 flex items-center gap-2"
            >
              <Tag className="w-4 h-4 text-rose-400" />
              Game đang giảm giá
            </Link>
            <Link
              href="/wishlist"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2.5 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800 flex items-center justify-between"
            >
              <span>Danh sách yêu thích</span>
              <span className="text-xs bg-rose-900/60 text-rose-300 px-2 py-0.5 rounded-full">
                {totalWishlistCount}
              </span>
            </Link>
            <Link
              href="/cart"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2.5 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800 flex items-center justify-between"
            >
              <span>Giỏ hàng</span>
              <span className="text-xs bg-cyan-900/60 text-cyan-300 px-2 py-0.5 rounded-full">
                {totalCartCount}
              </span>
            </Link>

            {mounted && currentUser ? (
              <div className="pt-2 border-t border-slate-800">
                <Link
                  href="/orders"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2.5 rounded-lg text-sm font-medium text-cyan-400 hover:bg-slate-800 flex items-center gap-2"
                >
                  <PackageCheck className="w-4 h-4" />
                  Đơn hàng đã mua
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium text-rose-400 hover:bg-rose-950/30 flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Đăng xuất ({currentUser.name})
                </button>
              </div>
            ) : (
              <div className="pt-2 border-t border-slate-800">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-indigo-600 to-cyan-600 text-white"
                >
                  <User className="w-4 h-4" />
                  Đăng nhập tài khoản demo
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
