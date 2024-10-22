export interface ReviewDTO {
  id: string;
  movieId: number;
  userId: number;
  rating: number;
  comment: string;
  likes: number;
  createdAt: Date;
}
