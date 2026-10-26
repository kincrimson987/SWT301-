'use client';

import React from 'react';
import Link from 'next/link';
import { Gamepad2, ShieldCheck, Zap, Headphones, Heart } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-slate-800/80 bg-slate-950 text-slate-400 mt-auto">
      {/* Value props banner */}
      <div className="border-b border-slate-800/60 py-8 bg-slate-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-cyan-950/60 border border-cyan-800/50 flex items-center justify-center text-cyan-400 shrink-0">
              <Zap className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-slate-100 font-semibold text-sm">Giao Key Kỹ Thuật Số Ngay Lập Tức</h4>
              <p className="text-xs text-slate-400 mt-0.5">Nhận mã kích hoạt bản quyền ngay sau khi thanh toán demo thành công.</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-950/60 border border-indigo-800/50 flex items-center justify-center text-indigo-400 shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-slate-100 font-semibold text-sm">Bản Quyền 100% Chính Hãng</h4>
              <p className="text-xs text-slate-400 mt-0.5">Mô phỏng quy trình cấp phép phân phối từ các nhà phát triển game PC.</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-purple-950/60 border border-purple-800/50 flex items-center justify-center text-purple-400 shrink-0">
              <Headphones className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-slate-100 font-semibold text-sm">Hỗ Trợ Kỹ Thuật 24/7</h4>
              <p className="text-xs text-slate-400 mt-0.5">Đội ngũ kỹ thuật viên sẵn sàng giải đáp thắc mắc cài đặt và cấu hình game.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main footer links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-400 flex items-center justify-center">
                <Gamepad2 className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-lg text-white">GameHub Store</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Nền tảng mua sắm key game kỹ thuật số bản quyền hàng đầu. Khám phá hàng nghìn tựa game bom tấn với ưu đãi tốt nhất mỗi ngày.
            </p>
            <div className="text-[11px] text-amber-400/90 bg-amber-950/30 border border-amber-900/40 p-2.5 rounded-lg">
              Lưu ý: Website được xây dựng làm dự án mẫu frontend & môi trường kiểm thử phần mềm. Không xử lý giao dịch tiền thật.
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h5 className="text-slate-200 text-sm font-semibold mb-4 tracking-wider uppercase">Khám Phá</h5>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/" className="hover:text-cyan-400 transition-colors">Trang chủ</Link>
              </li>
              <li>
                <Link href="/store" className="hover:text-cyan-400 transition-colors">Tất cả game</Link>
              </li>
              <li>
                <Link href="/store?discount=true" className="hover:text-cyan-400 transition-colors">Game đang giảm giá</Link>
              </li>
              <li>
                <Link href="/wishlist" className="hover:text-cyan-400 transition-colors">Danh sách yêu thích</Link>
              </li>
              <li>
                <Link href="/cart" className="hover:text-cyan-400 transition-colors">Giỏ hàng</Link>
              </li>
            </ul>
          </div>

          {/* Genres */}
          <div>
            <h5 className="text-slate-200 text-sm font-semibold mb-4 tracking-wider uppercase">Thể Loại Phổ Biến</h5>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/store?genre=Action" className="hover:text-cyan-400 transition-colors">Game Hành Động (Action)</Link>
              </li>
              <li>
                <Link href="/store?genre=RPG" className="hover:text-cyan-400 transition-colors">Nhập Vai (RPG)</Link>
              </li>
              <li>
                <Link href="/store?genre=Strategy" className="hover:text-cyan-400 transition-colors">Chiến Thuật (Strategy)</Link>
              </li>
              <li>
                <Link href="/store?genre=Simulation" className="hover:text-cyan-400 transition-colors">Mô Phỏng (Simulation)</Link>
              </li>
              <li>
                <Link href="/store?genre=Racing" className="hover:text-cyan-400 transition-colors">Đua Xe (Racing)</Link>
              </li>
            </ul>
          </div>

          {/* Support & Account */}
          <div>
            <h5 className="text-slate-200 text-sm font-semibold mb-4 tracking-wider uppercase">Tài Khoản & Trợ Giúp</h5>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/login" className="hover:text-cyan-400 transition-colors">Đăng nhập tài khoản</Link>
              </li>
              <li>
                <Link href="/register" className="hover:text-cyan-400 transition-colors">Đăng ký thành viên</Link>
              </li>
              <li>
                <Link href="/orders" className="hover:text-cyan-400 transition-colors">Tra cứu đơn hàng demo</Link>
              </li>
              <li className="pt-2 text-slate-500">
                Email demo: <span className="text-cyan-400/80 font-mono">support@gamehub.vn</span>
              </li>
              <li className="text-slate-500">
                Hotline hỗ trợ: <span className="text-slate-300">1900 8888 (Demo)</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-900 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© 2026 GameHub Digital Store. Bản quyền thiết kế Frontend UI/UX.</p>
          <p className="flex items-center gap-1">
            Xây dựng với <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> bởi Senior Frontend Developer
          </p>
        </div>
      </div>
    </footer>
  );
}
