import { Game } from '@/features/games/domain/game.types';

export interface ReviewAuthor {
  id: string;
  name: string;
}

export interface Review {
  id: string;
  userId: string;
  user?: ReviewAuthor;
  gameId: string;
  rating: number;
  content: string;
  hoursPlayed: number;
  isDeleted?: boolean;
  createdAt: string;
  updatedAt?: string;
  game?: Game;
}

export interface CreateReviewDTO {
  gameId: string;
  rating: number;
  content: string;
  hoursPlayed: number;
}

export interface UpdateReviewDTO {
  rating?: number;
  content?: string;
  hoursPlayed?: number;
}

export interface GenreHourStat {
  genre: string;
  hours: number;
}

export interface UserStatsResponse {
  totalHours: number;
  totalReviews: number;
  hoursByGenre: GenreHourStat[];
}

