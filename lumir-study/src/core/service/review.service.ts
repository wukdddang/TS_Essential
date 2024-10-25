import { ReviewDTO } from "../dto/review";
import { Repository } from "../../interfaces/repository.interface";
import { Review } from "../entities/model/review";
import { MovieService } from "./movie.service";

export class ReviewService {
  private static instance: ReviewService;
  private _movieRepository: Repository<ReviewDTO>;
  private _movieService: MovieService;

  private constructor(reviewRepository: Repository<ReviewDTO>) {
    this._movieRepository = reviewRepository;
  }

  public static getInstance(
    reviewRepository: Repository<ReviewDTO>
  ): ReviewService {
    if (!ReviewService.instance) {
      ReviewService.instance = new ReviewService(reviewRepository);
    }
    return ReviewService.instance;
  }

  public setMovieService(movieService: MovieService): void {
    this._movieService = movieService;
  }

  async initialize(): Promise<void> {
    await this._movieRepository.initialize();
  }

  async addReview(reviewDTO: Omit<ReviewDTO, "id">): Promise<ReviewDTO> {
    // 영화 존재 여부 확인
    const response = await this._movieService.getMovieById(reviewDTO.movieId);
    console.log(response);

    const reviews = await this._movieRepository.findAll();
    const existingReview = reviews.find(
      (review) =>
        review.movieId === reviewDTO.movieId &&
        review.userId === reviewDTO.userId
    );

    if (existingReview) {
      throw new Error("User has already reviewed this movie");
    }

    if (!Review.validateReviewDTO(reviewDTO)) {
      throw new Error("Invalid review data");
    }

    return await this._movieRepository.save(reviewDTO);
  }

  async updateReview(reviewId: string, comment: string): Promise<ReviewDTO> {
    const reviews = await this._movieRepository.findAll();
    const reviewIndex = reviews.findIndex((r) => r.id === reviewId);

    if (reviewIndex === -1) {
      throw new Error("Review not found");
    }

    const updatedReview = { ...reviews[reviewIndex], comment };
    reviews[reviewIndex] = updatedReview;
    await this._movieRepository.save(updatedReview);
    return updatedReview;
  }

  async addLike(movieId: number, reviewId: string): Promise<ReviewDTO> {
    const reviews = await this._movieRepository.findAll();
    const reviewIndex = reviews.findIndex(
      (r) => r.id === reviewId && r.movieId === movieId
    );

    if (reviewIndex === -1) {
      throw new Error("Review not found");
    }

    const review = Review.fromDTO(reviews[reviewIndex]);
    review.addLike();
    const updatedReview = review.toDTO();
    reviews[reviewIndex] = updatedReview;

    await this._movieRepository.save(updatedReview);
    return updatedReview;
  }

  async getReviewsByMovieId(movieId: number): Promise<ReviewDTO[]> {
    const reviews = await this._movieRepository.findAll();
    return reviews.filter((review) => review.movieId === movieId);
  }

  async getReviewsByUserId(userId: number): Promise<ReviewDTO[]> {
    const reviews = await this._movieRepository.findAll();
    return reviews.filter((review) => review.userId === userId);
  }

  async getMostLikedReview(movieId: number): Promise<ReviewDTO | null> {
    const reviews = await this.getReviewsByMovieId(movieId);

    if (reviews.length === 0) {
      return null;
    }

    return reviews.reduce((max, review) =>
      (review.likes || 0) > (max.likes || 0) ? review : max
    );
  }

  async getReviewsByRating(
    movieId: number,
    minRating: number,
    maxRating: number
  ): Promise<ReviewDTO[]> {
    const reviews = await this.getReviewsByMovieId(movieId);
    return reviews.filter(
      (review) => review.rating >= minRating && review.rating <= maxRating
    );
  }

  async getUserTopReviewers(
    n: number
  ): Promise<{ userId: number; reviewCount: number }[]> {
    const reviews = await this._movieRepository.findAll();

    if (reviews.length === 0) {
      return [];
    }

    const userReviewCounts = reviews.reduce<Record<number, number>>(
      (acc, review) => {
        acc[review.userId] = (acc[review.userId] || 0) + 1;
        return acc;
      },
      {}
    );

    return Object.entries(userReviewCounts)
      .map(([userId, count]): { userId: number; reviewCount: number } => ({
        userId: Number(userId),
        reviewCount: count,
      }))
      .sort((a, b) => b.reviewCount - a.reviewCount)
      .slice(0, n);
  }

  async getMovieStats(movieId: number): Promise<{
    totalReviews: number;
    averageRating: number;
    positivePercentage: number;
  }> {
    const reviews = await this.getReviewsByMovieId(movieId);

    if (reviews.length === 0) {
      return {
        totalReviews: 0,
        averageRating: 0,
        positivePercentage: 0,
      };
    }

    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const positiveReviews = reviews.filter(
      (review) => review.rating >= 4
    ).length;

    return {
      totalReviews: reviews.length,
      averageRating: totalRating / reviews.length,
      positivePercentage: (positiveReviews / reviews.length) * 100,
    };
  }

  async getTopRatedMovies(
    n: number,
    minReviews: number
  ): Promise<
    Array<{
      movieId: number;
      averageRating: number;
      reviewCount: number;
    }>
  > {
    const reviews = await this._movieRepository.findAll();
    const movieStats = new Map<
      number,
      { totalRating: number; count: number }
    >();

    // 각 영화별 통계 계산
    reviews.forEach((review) => {
      const stats = movieStats.get(review.movieId) || {
        totalRating: 0,
        count: 0,
      };
      stats.totalRating += review.rating;
      stats.count += 1;
      movieStats.set(review.movieId, stats);
    });

    // 결과 변환 및 필터링
    const results = Array.from(movieStats.entries())
      .map(([movieId, stats]) => ({
        movieId,
        averageRating: stats.totalRating / stats.count,
        reviewCount: stats.count,
      }))
      .filter((movie) => movie.reviewCount >= minReviews)
      .sort((a, b) => b.averageRating - a.averageRating)
      .slice(0, n);

    return results;
  }
}
