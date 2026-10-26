import { Game } from './game';
import { Coupon } from './coupon';

export interface CartItem {
  game: Game;
  quantity: number;
}

export interface CartTotals {
  itemCount: number;
  originalSubtotal: number; // Sum of original prices * qty
  subtotal: number;         // Sum of current prices * qty
  totalSavings: number;     // originalSubtotal - subtotal
  discountAmount: number;   // From coupon
  finalTotal: number;       // subtotal - discountAmount
}
