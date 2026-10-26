'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Gamepad2,
  Lock,
  Mail,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  UserCheck,
} from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { useToast } from '@/components/ui/Toast';

export default function LoginPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const { login, currentUser } = useAuthStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    setIsLoading(true);

    // Call login logic
    const res = login(email, password);

    setTimeout(() => {
      setIsLoading(false);
      if (res.success) {
        setSuccessMessage(res.message);
        showToast(res.message, 'success');
        setTimeout(() => {
          router.push('/');
        }, 800);
      } else {
        setErrorMessage(res.message);
        showToast(res.message, 'error');
      }
    }, 300);
  };

  // Quick fill helper for testing
  const handleQuickFill = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setErrorMessage('');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        {/* Header Title */}
        <div className="text-center space-y-2">
          <div className="inline-flex w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-cyan-400 p-[1.5px] mb-2 shadow-lg shadow-indigo-600/30">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
              <Gamepad2 className="w-6 h-6 text-cyan-400" />
            </div>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Đăng Nhập GameHub
          </h1>
          <p className="text-xs text-slate-400">
            Đăng nhập để quản lý đơn hàng game và kho key kỹ thuật số của bạn
          </p>
        </div>

        {/* Card Container */}
        <div className="bg-slate-900/90 border border-slate-800/80 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl space-y-6">
          {/* Error Alert Box */}
          {errorMessage && (
            <div
              data-testid="login-error-alert"
              className="p-4 rounded-xl bg-rose-950/80 border border-rose-500/50 text-rose-200 text-xs flex items-start gap-3 animate-in fade-in"
            >
              <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <span className="font-bold block">Đăng nhập không thành công</span>
                <span>{errorMessage}</span>
              </div>
            </div>
          )}

          {/* Success Alert Box */}
          {successMessage && (
            <div
              data-testid="login-success-alert"
              className="p-4 rounded-xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-200 text-xs flex items-center gap-3 animate-in fade-in"
            >
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <span className="font-semibold">{successMessage}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div className="space-y-1.5">
              <label
                htmlFor="login-email"
                className="text-xs font-bold text-slate-300 block"
              >
                Địa chỉ Email <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  id="login-email"
                  type="email"
                  name="email"
                  required
                  placeholder="ví dụ: gamer@gamehub.vn"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  data-testid="login-email-input"
                  className="w-full bg-slate-950 text-sm text-slate-200 placeholder-slate-500 pl-10 pr-4 py-3 rounded-xl border border-slate-800 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-all"
                />
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="login-password"
                  className="text-xs font-bold text-slate-300 block"
                >
                  Mật khẩu <span className="text-rose-500">*</span>
                </label>
              </div>
              <div className="relative">
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  required
                  placeholder="Nhập mật khẩu của bạn"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  data-testid="login-password-input"
                  className="w-full bg-slate-950 text-sm text-slate-200 placeholder-slate-500 pl-10 pr-11 py-3 rounded-xl border border-slate-800 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-all"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  data-testid="toggle-password-visibility"
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 p-1"
                  aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 text-xs text-slate-400 hover:text-slate-200 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  data-testid="remember-me-checkbox"
                  className="rounded border-slate-700 text-cyan-500 focus:ring-cyan-500/40 bg-slate-950 w-4 h-4 cursor-pointer"
                />
                <span>Ghi nhớ đăng nhập</span>
              </label>

              <span className="text-xs text-slate-500">
                Bản thử nghiệm Frontend
              </span>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              data-testid="login-submit-button"
              className="w-full py-3.5 px-6 rounded-xl font-bold text-sm bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white shadow-lg shadow-indigo-600/25 transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2"
            >
              <span>{isLoading ? 'Đang xác thực...' : 'Đăng nhập vào GameHub'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo Helper for Testers */}
          <div className="pt-4 border-t border-slate-800/80 space-y-2.5">
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              <UserCheck className="w-3.5 h-3.5 text-cyan-400" />
              <span>Tài Khoản Thử Nghiệm Nhanh (Click để điền)</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() =>
                  handleQuickFill('gamer@gamehub.vn', 'Demo@123456')
                }
                data-testid="demo-account-gamer"
                className="p-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-left transition-colors"
              >
                <div className="font-semibold text-slate-200">Gamer Mặc Định</div>
                <div className="text-[11px] text-cyan-400 font-mono">gamer@gamehub.vn</div>
                <div className="text-[10px] text-slate-500">Mật khẩu: Demo@123456</div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickFill('pro@gamehub.vn', 'Vip@123456')}
                data-testid="demo-account-vip"
                className="p-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-left transition-colors"
              >
                <div className="font-semibold text-slate-200">Tài Khoản VIP</div>
                <div className="text-[11px] text-purple-400 font-mono">pro@gamehub.vn</div>
                <div className="text-[10px] text-slate-500">Mật khẩu: Vip@123456</div>
              </button>
            </div>

            {/* Invalid scenario button */}
            <button
              type="button"
              onClick={() => handleQuickFill('wrong@gamehub.vn', 'wrongpass')}
              data-testid="demo-account-invalid"
              className="w-full py-1.5 px-3 rounded-lg bg-rose-950/30 hover:bg-rose-950/50 border border-rose-900/40 text-[11px] text-rose-300 transition-colors text-center"
            >
              Thử kịch bản đăng nhập sai (Kiểm thử lỗi)
            </button>
          </div>

          {/* Register Link */}
          <div className="text-center text-xs text-slate-400">
            Chưa có tài khoản?{' '}
            <Link
              href="/register"
              data-testid="register-redirect-link"
              className="text-cyan-400 hover:text-cyan-300 font-semibold"
            >
              Đăng ký tài khoản demo ngay
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
