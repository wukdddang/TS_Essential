import { Movie } from "../model/movie";
import { Review } from "../model/review";
import { MovieDTO } from "../dto/movie";
import { ReviewDTO } from "../dto/review";
import { Genre } from "../types/genre";
import { DatabaseManager } from "../db/db-manager";
import * as path from "path";

export class MovieReviewService {
  // ? 영화를 저장하는 맵
  private movies: Map<number, Movie> = new Map();
  private _currentMovieId: number = 1;
  private _currentReviewId: number = 1;
  private _dbManager: DatabaseManager;

  constructor() {
    const dbPath = path.join(process.cwd(), "/src/core/db");
    this._dbManager = new DatabaseManager(dbPath);
  }

  private _getNextMovieId(): number {
    return this._currentMovieId++;
  }

  private _getNextReviewId(): string {
    return `R${this._currentReviewId++}`;
  }

  async initialize(): Promise<void> {
    await this._dbManager.initialize();
    await this.loadData();
  }

  private async loadData(): Promise<void> {
    try {
      // Load movies
      const movieDTOs = await this._dbManager.readMovies<MovieDTO>();
      let maxMovieId = 0;

      for (const movieDTO of movieDTOs) {
        this.movies.set(movieDTO.id, new Movie(movieDTO));
        maxMovieId = Math.max(maxMovieId, movieDTO.id);
      }
      this._currentMovieId = maxMovieId + 1;

      // Load reviews
      const reviewDTOs = await this._dbManager.readReviews<ReviewDTO>();
      let maxReviewId = 0;

      for (const reviewDTO of reviewDTOs) {
        const movie = this.movies.get(reviewDTO.movieId);
        if (movie) {
          movie.addReview(reviewDTO);
          maxReviewId = Math.max(maxReviewId, parseInt(reviewDTO.id.slice(1)));
        }
      }
      this._currentReviewId = maxReviewId + 1;
    } catch (error) {
      console.error("Error loading data:", error);
      throw new Error("Failed to load data from database");
    }
  }

  private async saveData(): Promise<void> {
    try {
      // Save movies
      const movies = Array.from(this.movies.values());
      await this._dbManager.writeMovies(movies.map((movie) => movie.toDTO()));

      // Save reviews
      const reviews = movies.flatMap((movie) => movie.reviews);
      await this._dbManager.writeReviews(reviews);
    } catch (error) {
      console.error("Error saving data:", error);
      throw new Error("Failed to save data to database");
    }
  }

  // ? 영화 추가 메서드
  async addMovie(movieDTO: Omit<MovieDTO, "id">): Promise<void> {
    const movieId = this._getNextMovieId();
    const movieWithId = {
      ...movieDTO,
      id: movieId,
    };

    const movie = new Movie(movieWithId);

    const isExistingMovie = Array.from(this.movies.values()).find(
      (existingMovie) =>
        existingMovie.title === movie.title &&
        existingMovie.director === movie.director
    );

    if (isExistingMovie) {
      throw new Error("Movie already exists");
    }

    if (!Movie.validateMovieDTO(movieWithId)) {
      throw new Error("Invalid movie data");
    }

    this.movies.set(movie.id, movie);
    await this.saveData();
  }

  // ? 리뷰 추가 메서드
  async addReview(reviewDTO: Omit<ReviewDTO, "id">): Promise<void> {
    const movie = this.movies.get(reviewDTO.movieId);

    if (!movie) {
      throw new Error("Movie not found");
    }

    const reviewWithId = {
      ...reviewDTO,
      id: this._getNextReviewId(),
    };

    try {
      if (!Review.validateReviewDTO(reviewWithId)) {
        throw new Error("Invalid review data");
      }

      movie.addReview(reviewWithId);
      await this.saveData();
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`리뷰 추가 실패: ${error.message}`);
      } else {
        throw new Error("리뷰 추가 중 알 수 없는 오류가 발생했습니다");
      }
    }
  }

  // ? 리뷰에 좋아요 추가 메서드
  async addLike(movieId: number, reviewId: string): Promise<void> {
    const movie = this.movies.get(movieId);

    if (!movie) {
      throw new Error("Movie not found");
    }

    const review = movie.reviews.find((review) => review.id === reviewId);

    if (!review) {
      throw new Error("Review not found");
    }
    const reviewObj = Review.fromDTO(review);
    reviewObj.addLike();

    const reviewIndex = movie.reviews.findIndex((r) => r.id === reviewId);
    movie.reviews[reviewIndex] = reviewObj.toDTO();

    await this.saveData();
  }

  // ? 영화와 리뷰를 함께 반환하는 메서드.
  getMovieWithReviews(
    movieId: number
  ): (MovieDTO & { reviews: ReviewDTO[]; averageRating: number }) | null {
    const movie = this.movies.get(movieId);

    if (!movie) {
      throw new Error("Movie was not found");
    }

    return {
      ...movie.toDTO(),
      reviews: movie.reviews,
      ...this.getMovieStats(movieId),
    };
  }

  // ? 가장 인기 있는 리뷰를 반환하는 메서드
  getMostLikedReview(movieId: number): ReviewDTO | null {
    const movie = this.movies.get(movieId);

    if (!movie) {
      throw new Error("Movie not found");
    }

    if (movie.reviews.length === 0) {
      return null;
    }

    return movie.getTopReviews();
  }

  // ? 평점이 높은 영화를 반환하는 메서드
  getTopRatedMovies(n: number, minReviews: number): MovieDTO[] {
    const movies = Array.from(this.movies.values()).filter(
      (movie) => movie.reviews.length >= minReviews
    );

    return movies
      .sort((a, b) => b.getAverageRating() - a.getAverageRating())
      .slice(0, n)
      .map((movie) => movie.toDTO());
  }

  // ? 장르별 영화를 반환하는 메서드
  getMoviesByGenre(genre: Genre): MovieDTO[] {
    const movies = Array.from(this.movies.values()).filter(
      (movie) => movie.genre === genre
    );

    return movies.map((movie) => movie.toDTO());
  }

  // ? 리뷰 수가 가장 많은 n명의 사용자를 반환하는 메서드
  getUserTopReviewers(n: number): { userId: number; reviewCount: number }[] {
    const allReviews = Array.from(this.movies.values()).flatMap(
      (movie) => movie.reviews
    );

    if (allReviews.length === 0) {
      return [];
    }

    const userReviewCounts = allReviews.reduce((acc, review) => {
      acc[review.userId] = (acc[review.userId] || 0) + 1;
      return acc;
    }, {} as Record<number, number>);

    return Object.entries(userReviewCounts)
      .map(([userId, count]) => ({
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
    const movie = this.movies.get(movieId);
    if (!movie) {
      throw new Error("영화를 찾을 수 없습니다.");
    }

    movie.updateDetails(updates);
    this.movies.set(movieId, movie);
    await this.saveData();
  }

  // ? 리뷰 수정 메서드
  async updateReview(reviewId: string, comment: string): Promise<void> {
    try {
      let foundMovie: Movie | undefined;
      let reviewIndex: number = -1;

      const movies = Array.from(this.movies.values());

      for (const movie of movies) {
        reviewIndex = movie.reviews.findIndex((r) => r.id === reviewId);
        if (reviewIndex !== -1) {
          foundMovie = movie;
          break;
        }
      }

      if (!foundMovie || reviewIndex === -1) {
        throw new Error("Review not found");
      }

      const reviewDTO = foundMovie.reviews[reviewIndex];
      const reviewObj = Review.fromDTO(reviewDTO);
      reviewObj.updateComment(comment);

      foundMovie.reviews[reviewIndex] = reviewObj.toDTO();

      await this.saveData();
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`리뷰 수정 실패: ${error.message}`);
      } else {
        throw new Error("리뷰 수정 중 알 수 없는 오류가 발생했습니다");
      }
    }
  }

  // ? 평점이 높은 영화를 반환하는 메서드
  getReviewsByRating(
    movieId: number,
    minRating: number,
    maxRating: number
  ): ReviewDTO[] {
    const movie = this.movies.get(movieId);
    if (!movie) {
      throw new Error("Movie not found");
    }
    return movie.getReviewsByRating(minRating, maxRating);
  }

  // ? 영화 통계를 반환하는 메서드
  getMovieStats(movieId: number): {
    totalReviews: number;
    averageRating: number;
    positivePercentage: number;
  } | null {
    const movie = this.movies.get(movieId);
    if (!movie) {
      return null;
    }

    const totalReviews = movie.reviews.length;
    const averageRating = movie.getAverageRating();
    const positivePercentage =
      totalReviews === 0
        ? 0
        : (movie.reviews.filter((review) => Review.fromDTO(review).isPositive())
            .length /
            totalReviews) *
          100;

    return { totalReviews, averageRating, positivePercentage };
  }

  // ? 영화 검색 메서드
  searchMovies(query: string): MovieDTO[] {
    const movies = Array.from(this.movies.values()).filter(
      (movie) =>
        movie.title.toLowerCase().includes(query.toLowerCase()) ||
        movie.director.toLowerCase().includes(query.toLowerCase())
    );
    return movies.map((movie) => movie.toDTO());
  }

  // ? 영화 추천 메서드
  // TODO: 사용자의 리뷰 히스토리를 기반으로 영화 추천
  // 1. 사용자가 높은 평점을 준 영화들의 장르를 분석
  // 2. 해당 장르의 영화 중 사용자가 아직 리뷰하지 않은 영화를 선택
  // 3. 선택된 영화들 중 전체 평점이 높은 순으로 정렬
  // 4. 상위 'count'개의 영화를 반환
  // }
  recommendMovies(userId: number, count: number): MovieDTO[] {
    const reviews = Array.from(this.movies.values())
      .flatMap((movie) => movie.reviews)
      .filter((review) => review.userId === userId)
      .filter((review) => Review.fromDTO(review).isPositive());

    const preferredGenres = reviews.map(
      (review) => this.movies.get(review.movieId).genre as Genre
    );

    const reviewedMovies = reviews.map((review) => review.movieId);

    const recommendMovies = Array.from(this.movies.values()).filter(
      (movie) =>
        !reviewedMovies.includes(movie.id) &&
        preferredGenres.includes(movie.genre as Genre)
    );

    return recommendMovies
      .sort((a, b) => b.getAverageRating() - a.getAverageRating())
      .slice(0, count)
      .map((movie) => movie.toDTO());
  }
}
