export interface Genre {
  id: string;
  name: string;
  slug: string;
}

export interface ReviewAuthor {
  id: string;
  name: string;
}

export interface ReviewItem {
  id: string;
  rating: number;
  content: string;
  hoursPlayed: number;
  createdAt?: string;
  user: ReviewAuthor;
}

export interface Game {
  id: string;
  title: string;
  description: string;
  coverUrl: string;
  bannerUrl?: string | null;
  releaseDate: string;
  genreId: string;
  genre?: Genre;
  reviews?: ReviewItem[];
}

export interface PaginationMeta {
  total: number;
  currentPage: number;
  limit: number;
  totalPages: number;
}

export interface PaginatedGamesResponse {
  data: Game[];
  pagination: PaginationMeta;
}

export interface GameFilter {
  page?: number;
  limit?: number;
  genre?: string;
  search?: string;
  sort?: 'recent' | 'popular';
}

