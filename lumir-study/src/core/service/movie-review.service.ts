import { Movie } from "../entities/model/movie";
import { Review } from "../entities/model/review";
import { MovieDTO } from "../dto/movie";
import { ReviewDTO } from "../dto/review";
import { Genre } from "../../types/genre";
import { DatabaseManager, DBType } from "../../db/db-manager";
import * as path from "path";

export class MovieReviewService {
  // ? 영화를 저장하는 맵
  private _currentMovieId: number = 1;
  private _currentReviewId: number = 1;
  private _dbManager: DatabaseManager;

  private static instance: MovieReviewService | null = null;

  private constructor() {
    const dbPath = path.join(process.cwd(), "/src/db");
    this._dbManager = new DatabaseManager(
      dbPath,
      ["Movie", "Review"],
      DBType.FILE
    );
  }

  public static getInstance(): MovieReviewService {
    if (!MovieReviewService.instance) {
      MovieReviewService.instance = new MovieReviewService();
    }
    return MovieReviewService.instance;
  }

  private _getNextMovieId(): number {
    return this._currentMovieId++;
  }

  private _getNextReviewId(): string {
    return `R${this._currentReviewId++}`;
  }

  async initialize(): Promise<void> {
    await this._dbManager.initialize();
    // Initialize IDs based on existing data
    const movies = await this._dbManager.readMovies<MovieDTO>();
    const reviews = await this._dbManager.readReviews<ReviewDTO>();

    this._currentMovieId = Math.max(...movies.map((m) => m.id), 0) + 1;
    this._currentReviewId =
      Math.max(...reviews.map((r) => parseInt(r.id.slice(1))), 0) + 1;
  }

  // ? 영화 추가 메서드
  async addMovie(movieDTO: Omit<MovieDTO, "id">): Promise<void> {
    const movies = await this._dbManager.readMovies<MovieDTO>();

    const isExistingMovie = movies.some(
      (movie) =>
        movie.title === movieDTO.title && movie.director === movieDTO.director
    );

    if (isExistingMovie) {
      throw new Error("Movie already exists");
    }

    const movieId = this._getNextMovieId();
    const movieWithId = { ...movieDTO, id: movieId };

    if (!Movie.validateMovieDTO(movieWithId)) {
      throw new Error("Invalid movie data");
    }

    movies.push(movieWithId);
    await this._dbManager.writeMovies(movies);
  }

  // ? 리뷰 추가 메서드
  async addReview(reviewDTO: Omit<ReviewDTO, "id">): Promise<void> {
    const [movies, reviews] = await Promise.all([
      this._dbManager.readMovies<MovieDTO>(),
      this._dbManager.readReviews<ReviewDTO>(),
    ]);

    const movie = movies.find((m) => m.id === reviewDTO.movieId);
    if (!movie) {
      throw new Error("Movie not found");
    }

    const existingReview = reviews.find(
      (review) =>
        review.movieId === reviewDTO.movieId &&
        review.userId === reviewDTO.userId
    );

    if (existingReview) {
      throw new Error("User has already reviewed this movie");
    }

    const reviewWithId = {
      ...reviewDTO,
      id: this._getNextReviewId(),
    };

    if (!Review.validateReviewDTO(reviewWithId)) {
      throw new Error("Invalid review data");
    }

    reviews.push(reviewWithId);
    await this._dbManager.writeReviews(reviews);
  }

  // ? 리뷰에 좋아요 추가 메서드
  async addLike(movieId: number, reviewId: string): Promise<void> {
    const reviews = await this._dbManager.readReviews<ReviewDTO>();
    const reviewIndex = reviews.findIndex(
      (r) => r.id === reviewId && r.movieId === movieId
    );

    if (reviewIndex === -1) {
      throw new Error("Review not found");
    }

    const review = Review.fromDTO(reviews[reviewIndex]);
    review.addLike();
    reviews[reviewIndex] = review.toDTO();

    await this._dbManager.writeReviews(reviews);
  }

  // ? 영화와 리뷰를 함께 반환하는 메서드.
  async getMovieWithReviews(
    movieId: number
  ): Promise<MovieDTO & { reviews: ReviewDTO[]; averageRating: number }> {
    const [movies, reviews] = await Promise.all([
      this._dbManager.readMovies<MovieDTO>(),
      this._dbManager.readReviews<ReviewDTO>(),
    ]);

    const movie = movies.find((m) => m.id === movieId);
    if (!movie) {
      throw new Error("Movie not found");
    }

    const movieReviews = reviews.filter((r) => r.movieId === movieId);
    const stats = this.calculateMovieStats(movieReviews);

    return {
      ...movie,
      reviews: movieReviews,
      averageRating: stats.averageRating,
    };
  }

  private calculateMovieStats(reviews: ReviewDTO[]) {
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

  // ? 가장 인기 있는 리뷰를 반환하는 메서드
  async getMostLikedReview(movieId: number): Promise<ReviewDTO | null> {
    const reviews = await this._dbManager.readReviews<ReviewDTO>();
    const movieReviews = reviews.filter((r) => r.movieId === movieId);

    if (movieReviews.length === 0) {
      return null;
    }

    return movieReviews.reduce((max, review) =>
      (review.likes || 0) > (max.likes || 0) ? review : max
    );
  }

  // ? 평점이 높은 영화를 반환하는 메서드
  async getTopRatedMovies(n: number, minReviews: number): Promise<MovieDTO[]> {
    const [movies, reviews] = await Promise.all([
      this._dbManager.readMovies<MovieDTO>(),
      this._dbManager.readReviews<ReviewDTO>(),
    ]);

    const movieRatings = movies.map((movie) => {
      const movieReviews = reviews.filter((r) => r.movieId === movie.id);
      const stats = this.calculateMovieStats(movieReviews);
      return {
        ...movie,
        averageRating: stats.averageRating,
        reviewCount: movieReviews.length,
      };
    });

    return movieRatings
      .filter((movie) => movie.reviewCount >= minReviews)
      .sort((a, b) => b.averageRating - a.averageRating)
      .slice(0, n);
  }

  // ? 장르별 영화를 반환하는 메서드
  async getMoviesByGenre(genre: Genre): Promise<MovieDTO[]> {
    const movies = await this._dbManager.readMovies<MovieDTO>();
    return movies.filter((movie) => movie.genre === genre);
  }

  // ? 리뷰 수가 가장 많은 n명의 사용자를 반환하는 메서드
  async getUserTopReviewers(
    n: number
  ): Promise<{ userId: number; reviewCount: number }[]> {
    const reviews = await this._dbManager.readReviews<ReviewDTO>();

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

  // ? 영화 상세 수정 메서드
  async updateMovie(
    movieId: number,
    updates: Partial<MovieDTO>
  ): Promise<void> {
    const movies = await this._dbManager.readMovies<MovieDTO>();
    const movieIndex = movies.findIndex((m) => m.id === movieId);

    if (movieIndex === -1) {
      throw new Error("Movie not found");
    }

    movies[movieIndex] = { ...movies[movieIndex], ...updates };
    await this._dbManager.writeMovies(movies);
  }

  // ? 리뷰 수정 메서드
  async updateReview(reviewId: string, comment: string): Promise<void> {
    const reviews = await this._dbManager.readReviews<ReviewDTO>();
    const reviewIndex = reviews.findIndex((r) => r.id === reviewId);

    if (reviewIndex === -1) {
      throw new Error("Review not found");
    }

    reviews[reviewIndex] = { ...reviews[reviewIndex], comment };
    await this._dbManager.writeReviews(reviews);
  }

  // ? 평점이 높은 영화를 반환하는 메서드
  async getReviewsByRating(
    movieId: number,
    minRating: number,
    maxRating: number
  ): Promise<ReviewDTO[]> {
    const [movies, reviews] = await Promise.all([
      this._dbManager.readMovies<MovieDTO>(),
      this._dbManager.readReviews<ReviewDTO>(),
    ]);

    const movie = movies.find((m) => m.id === movieId);
    if (!movie) {
      throw new Error("Movie not found");
    }

    return reviews.filter(
      (review) =>
        review.movieId === movieId &&
        review.rating >= minRating &&
        review.rating <= maxRating
    );
  }

  // ? 영화 통계를 반환하는 메서드
  async getMovieStats(movieId: number): Promise<{
    totalReviews: number;
    averageRating: number;
    positivePercentage: number;
  } | null> {
    const [movies, reviews] = await Promise.all([
      this._dbManager.readMovies<MovieDTO>(),
      this._dbManager.readReviews<ReviewDTO>(),
    ]);

    const movie = movies.find((m) => m.id === movieId);
    if (!movie) {
      return null;
    }

    const movieReviews = reviews.filter((r) => r.movieId === movieId);
    return this.calculateMovieStats(movieReviews);
  }

  // ? 영화 검색 메서드
  async searchMovies(query: string): Promise<MovieDTO[]> {
    const movies = await this._dbManager.readMovies<MovieDTO>();
    const lowercaseQuery = query.toLowerCase();

    return movies.filter(
      (movie) =>
        movie.title.toLowerCase().includes(lowercaseQuery) ||
        movie.director.toLowerCase().includes(lowercaseQuery)
    );
  }

  // ? 영화 추천 메서드
  // TODO: 사용자의 리뷰 히스토리를 기반으로 영화 추천
  // 1. 사용자가 높은 평점을 준 영화들의 장르를 분석
  // 2. 해당 장르의 영화 중 사용자가 아직 리뷰하지 않은 영화를 선택
  // 3. 선택된 영화들 중 전체 평점이 높은 순으로 정렬
  // 4. 상위 'count'개의 영화를 반환
  // }
  async recommendMovies(userId: number, count: number): Promise<MovieDTO[]> {
    const [movies, reviews] = await Promise.all([
      this._dbManager.readMovies<MovieDTO>(),
      this._dbManager.readReviews<ReviewDTO>(),
    ]);

    // 사용자의 긍정적인 리뷰 찾기 (평점 4 이상)
    const userReviews = reviews.filter(
      (review) => review.userId === userId && review.rating >= 4
    );

    // 사용자가 리뷰한 영화들의 장르 선호도 분석
    const reviewedMovies = new Set(userReviews.map((review) => review.movieId));
    const preferredGenres = new Set(
      userReviews
        .map((review) => {
          const movie = movies.find((m) => m.id === review.movieId);
          return movie?.genre;
        })
        .filter((genre): genre is Genre => genre !== undefined)
    );

    // 선호 장르의 미리뷰 영화 찾기
    const movieRatings = movies
      .filter(
        (movie) =>
          !reviewedMovies.has(movie.id) && preferredGenres.has(movie.genre)
      )
      .map((movie) => {
        const movieReviews = reviews.filter((r) => r.movieId === movie.id);
        const stats = this.calculateMovieStats(movieReviews);
        return {
          ...movie,
          averageRating: stats.averageRating,
        };
      });

    // 평점순으로 정렬하고 요청된 수만큼 반환
    return movieRatings
      .sort((a, b) => b.averageRating - a.averageRating)
      .slice(0, count);
  }
}
