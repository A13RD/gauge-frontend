import { Game } from '@/features/games/domain/game.types';

export interface Review {
  id: string;
  userId: string;
  gameId: string;
  rating: number;
  content: string;
  hoursPlayed: number;
  createdAt: string;
  game?: Game;
}

export interface CreateReviewDTO {
  gameId: string;
  rating: number;
  content: string;
  hoursPlayed: number;
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

