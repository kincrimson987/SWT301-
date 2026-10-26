'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { User, DemoAccount } from '@/types/user';
import { DEMO_ACCOUNTS } from '@/data/demoUsers';

interface AuthState {
  currentUser: User | null;
  registeredUsers: DemoAccount[];
  hasHydrated: boolean;
  setHasHydrated: (state: boolean) => void;
  login: (email: string, password: string) => { success: boolean; message: string };
  register: (name: string, email: string, password: string) => { success: boolean; message: string };
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      currentUser: null,
      registeredUsers: [],
      hasHydrated: false,
      setHasHydrated: (state) => set({ hasHydrated: state }),

      login: (rawEmail: string, rawPassword: string) => {
        const email = rawEmail.trim().toLowerCase();
        const password = rawPassword.trim();

        if (!email || !password) {
          return {
            success: false,
            message: 'Vui lòng nhập đầy đủ email và mật khẩu.',
          };
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
          return {
            success: false,
            message: 'Email không đúng định dạng, vui lòng kiểm tra lại.',
          };
        }

        // Kiểm tra trong danh sách DEMO_ACCOUNTS hoặc registeredUsers
        const allAccounts = [...DEMO_ACCOUNTS, ...get().registeredUsers];
        const match = allAccounts.find(
          (acc) => acc.email.toLowerCase() === email && acc.password === password
        );

        if (!match) {
          return {
            success: false,
            message: 'Tài khoản hoặc mật khẩu không chính xác.',
          };
        }

        // Tạo thông tin phiên đăng nhập (không chứa mật khẩu)
        const sessionUser: User = {
          id: `user-${Date.now()}`,
          email: match.email,
          name: match.name,
          role: match.role,
          createdAt: new Date().toISOString(),
        };

        set({ currentUser: sessionUser });
        return {
          success: true,
          message: `Chào mừng trở lại, ${sessionUser.name}!`,
        };
      },

      register: (rawName: string, rawEmail: string, rawPassword: string) => {
        const name = rawName.trim();
        const email = rawEmail.trim().toLowerCase();
        const password = rawPassword.trim();

        if (!name || !email || !password) {
          return {
            success: false,
            message: 'Vui lòng điền đầy đủ các thông tin đăng ký.',
          };
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
          return {
            success: false,
            message: 'Email không đúng định dạng.',
          };
        }

        if (password.length < 6) {
          return {
            success: false,
            message: 'Mật khẩu phải có ít nhất 6 ký tự.',
          };
        }

        const allAccounts = [...DEMO_ACCOUNTS, ...get().registeredUsers];
        const existing = allAccounts.find(
          (acc) => acc.email.toLowerCase() === email
        );

        if (existing) {
          return {
            success: false,
            message: 'Email này đã được sử dụng trên hệ thống demo.',
          };
        }

        const newAccount: DemoAccount = {
          name,
          email,
          password,
          role: 'user',
        };

        set((state) => ({
          registeredUsers: [...state.registeredUsers, newAccount],
        }));

        // Tự động đăng nhập người dùng mới
        const sessionUser: User = {
          id: `user-${Date.now()}`,
          email: newAccount.email,
          name: newAccount.name,
          role: newAccount.role,
          createdAt: new Date().toISOString(),
        };

        set({ currentUser: sessionUser });

        return {
          success: true,
          message: 'Đăng ký tài khoản thành công! Bạn đã được đăng nhập.',
        };
      },

      logout: () => {
        set({ currentUser: null });
      },
    }),
    {
      name: 'gamehub-auth-storage',
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
