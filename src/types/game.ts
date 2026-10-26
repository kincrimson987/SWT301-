export type GameGenre =
  | 'Action'
  | 'Adventure'
  | 'RPG'
  | 'Strategy'
  | 'Simulation'
  | 'Racing'
  | 'Horror'
  | 'Indie';

export interface SystemRequirements {
  os: string;
  processor: string;
  memory: string;
  graphics: string;
  storage: string;
}

export interface GameReview {
  id: string;
  author: string;
  rating: number;
  date: string;
  comment: string;
}

export interface Game {
  id: string;
  title: string;
  slug: string;
  shortDescription: string;
  description: string;
  coverImage: string;
  bannerImage: string;
  screenshots: string[];
  genre: GameGenre;
  tags: string[];
  steamAppId?: number | string;
  steamUrl?: string;
  originalPrice: number; // Integer VND, e.g. 800000
  currentPrice: number;  // Integer VND, e.g. 400000
  discountPercent: number; // 0 to 100
  isDiscounted: boolean;
  inStock: boolean;
  rating: number; // 0 to 5, e.g. 4.8
  reviewCount: number;
  releaseDate: string;
  platforms: string[];
  developer: string;
  publisher: string;
  isFeatured?: boolean;
  isBestSeller?: boolean;
  isNewRelease?: boolean;
  systemRequirements: {
    minimum: SystemRequirements;
    recommended: SystemRequirements;
  };
  reviews?: GameReview[];
}
