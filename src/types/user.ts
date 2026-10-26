export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: 'user' | 'vip' | 'admin';
  createdAt: string;
}

export interface DemoAccount {
  email: string;
  password: string; // Used only for demo matching in frontend
  name: string;
  role: 'user' | 'vip' | 'admin';
}
