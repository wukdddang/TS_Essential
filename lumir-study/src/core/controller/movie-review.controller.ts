import { MovieDTO } from "../dto/movie";
import { ReviewDTO } from "../dto/review";
import { MovieReviewService } from "../service/movie-review.service";
import { Genre } from "../../types/genre";

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export class MovieReviewController {
  private static instance: MovieReviewController;
  private movieReviewService: MovieReviewService;

  constructor() {
    this.movieReviewService = MovieReviewService.getInstance();

    // this.movieReviewService = new MovieReviewService();
  }

  public static getInstance(): MovieReviewController {
    if (!MovieReviewController.instance) {
      MovieReviewController.instance = new MovieReviewController();
    }
    return MovieReviewController.instance;
  }

  public async initialize(): Promise<ApiResponse<void>> {
    try {
      await this.movieReviewService.initialize();
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: "서비스 초기화 실패",
      };
    }
  }

  // Validation methods remain unchanged as they don't interact with the service layer
  private validateMovieInput(movieDTO: Omit<MovieDTO, "id">): string | null {
    if (!movieDTO.title?.trim()) {
      return "영화 제목은 필수입니다.";
    }
    if (!movieDTO.director?.trim()) {
      return "감독 이름은 필수입니다.";
    }
    if (
      !movieDTO.releaseYear ||
      movieDTO.releaseYear < 1888 ||
      movieDTO.releaseYear > new Date().getFullYear()
    ) {
      return "올바른 개봉년도를 입력해주세요.";
    }
    if (!Object.values(Genre).includes(movieDTO.genre)) {
      return "올바른 장르를 선택해주세요.";
    }
    if (!movieDTO.duration || movieDTO.duration <= 0) {
      return "올바른 상영시간을 입력해주세요.";
    }
    return null;
  }

  private validateReviewInput(reviewDTO: Omit<ReviewDTO, "id">): string | null {
    if (!reviewDTO.movieId) {
      return "영화 ID는 필수입니다.";
    }
    if (!reviewDTO.userId) {
      return "사용자 ID는 필수입니다.";
    }
    if (reviewDTO.rating < 1 || reviewDTO.rating > 5) {
      return "평점은 1-5 사이여야 합니다.";
    }
    if (!reviewDTO.comment?.trim()) {
      return "리뷰 내용은 필수입니다.";
    }
    return null;
  }

  private validateRatingRange(
    minRating: number,
    maxRating: number
  ): string | null {
    if (minRating < 1 || minRating > 5) {
      return "최소 평점은 1-5 사이여야 합니다.";
    }
    if (maxRating < 1 || maxRating > 5) {
      return "최대 평점은 1-5 사이여야 합니다.";
    }
    if (minRating > maxRating) {
      return "최소 평점이 최대 평점보다 클 수 없습니다.";
    }
    return null;
  }

  public async addMovie(
    movieDTO: Omit<MovieDTO, "id">
  ): Promise<ApiResponse<void>> {
    try {
      const validationError = this.validateMovieInput(movieDTO);
      if (validationError) {
        return {
          success: false,
          error: validationError,
        };
      }

      await this.movieReviewService.addMovie(movieDTO);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "영화 추가 중 오류가 발생했습니다.",
      };
    }
  }

  public async getTopRatedMovies(
    n: number,
    minReviews: number
  ): Promise<ApiResponse<MovieDTO[]>> {
    try {
      const movies = await this.movieReviewService.getTopRatedMovies(
        n,
        minReviews
      );
      return { success: true, data: movies };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "상위 평점 영화 조회 중 오류가 발생했습니다.",
      };
    }
  }

  public async getMoviesByGenre(
    genre: Genre
  ): Promise<ApiResponse<MovieDTO[]>> {
    try {
      const movies = await this.movieReviewService.getMoviesByGenre(genre);
      return { success: true, data: movies };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "장르별 영화 조회 중 오류가 발생했습니다.",
      };
    }
  }

  public async getMovieWithReviews(
    movieId: number
  ): Promise<
    ApiResponse<MovieDTO & { reviews: ReviewDTO[]; averageRating: number }>
  > {
    try {
      if (!movieId || movieId <= 0) {
        return {
          success: false,
          error: "올바른 영화 ID를 입력해주세요.",
        };
      }

      const movie = await this.movieReviewService.getMovieWithReviews(movieId);
      return { success: true, data: movie };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "영화 조회 중 오류가 발생했습니다.",
      };
    }
  }

  public async getMostLikedReview(
    movieId: number
  ): Promise<ApiResponse<ReviewDTO | null>> {
    try {
      if (!movieId || movieId <= 0) {
        return {
          success: false,
          error: "올바른 영화 ID를 입력해주세요.",
        };
      }

      const review = await this.movieReviewService.getMostLikedReview(movieId);
      return { success: true, data: review };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "리뷰 조회 중 오류가 발생했습니다.",
      };
    }
  }

  public async getUserTopReviewers(
    count: number
  ): Promise<ApiResponse<{ userId: number; reviewCount: number }[]>> {
    try {
      if (count <= 0) {
        return {
          success: false,
          error: "올바른 사용자 수를 입력해주세요.",
        };
      }

      const reviewers = await this.movieReviewService.getUserTopReviewers(
        count
      );
      return { success: true, data: reviewers };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "사용자 조회 중 오류가 발생했습니다.",
      };
    }
  }

  public async getReviewsByRating(
    movieId: number,
    minRating: number,
    maxRating: number
  ): Promise<ApiResponse<ReviewDTO[]>> {
    try {
      if (!movieId || movieId <= 0) {
        return {
          success: false,
          error: "올바른 영화 ID를 입력해주세요.",
        };
      }

      const ratingError = this.validateRatingRange(minRating, maxRating);
      if (ratingError) {
        return {
          success: false,
          error: ratingError,
        };
      }

      const reviews = await this.movieReviewService.getReviewsByRating(
        movieId,
        minRating,
        maxRating
      );
      return { success: true, data: reviews };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "리뷰 조회 중 오류가 발생했습니다.",
      };
    }
  }

  public async getMovieStats(movieId: number): Promise<
    ApiResponse<{
      totalReviews: number;
      averageRating: number;
      positivePercentage: number;
    } | null>
  > {
    try {
      if (!movieId || movieId <= 0) {
        return {
          success: false,
          error: "올바른 영화 ID를 입력해주세요.",
        };
      }

      const stats = await this.movieReviewService.getMovieStats(movieId);
      return { success: true, data: stats };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "통계 조회 중 오류가 발생했습니다.",
      };
    }
  }

  public async recommendMovies(
    userId: number,
    count: number
  ): Promise<ApiResponse<MovieDTO[]>> {
    try {
      if (!userId || userId <= 0) {
        return {
          success: false,
          error: "올바른 사용자 ID를 입력해주세요.",
        };
      }
      if (count <= 0) {
        return {
          success: false,
          error: "올바른 추천 영화 수를 입력해주세요.",
        };
      }

      const movies = await this.movieReviewService.recommendMovies(
        userId,
        count
      );
      return { success: true, data: movies };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "영화 추천 중 오류가 발생했습니다.",
      };
    }
  }

  public async updateReview(
    reviewId: string,
    comment: string
  ): Promise<ApiResponse<void>> {
    try {
      // 입력값 검증
      if (!reviewId?.trim()) {
        return {
          success: false,
          error: "리뷰 ID는 필수입니다.",
        };
      }
      if (!comment?.trim()) {
        return {
          success: false,
          error: "리뷰 내용은 필수입니다.",
        };
      }

      await this.movieReviewService.updateReview(reviewId, comment);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "리뷰 수정 중 오류가 발생했습니다.",
      };
    }
  }

  public async addLike(
    movieId: number,
    reviewId: string
  ): Promise<ApiResponse<void>> {
    try {
      if (!movieId || movieId <= 0) {
        return {
          success: false,
          error: "올바른 영화 ID를 입력해주세요.",
        };
      }
      if (!reviewId?.trim()) {
        return {
          success: false,
          error: "올바른 리뷰 ID를 입력해주세요.",
        };
      }

      await this.movieReviewService.addLike(movieId, reviewId);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "좋아요 추가 중 오류가 발생했습니다.",
      };
    }
  }

  public async searchMovies(query: string): Promise<ApiResponse<MovieDTO[]>> {
    try {
      if (!query?.trim()) {
        return {
          success: false,
          error: "검색어를 입력해주세요.",
        };
      }

      const movies = await this.movieReviewService.searchMovies(query);
      return {
        success: true,
        data: movies,
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "영화 검색 중 오류가 발생했습니다.",
      };
    }
  }

  public async addReview(
    reviewDTO: Omit<ReviewDTO, "id">
  ): Promise<ApiResponse<void>> {
    try {
      const validationError = this.validateReviewInput(reviewDTO);
      if (validationError) {
        return {
          success: false,
          error: validationError,
        };
      }

      await this.movieReviewService.addReview(reviewDTO);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "리뷰 추가 중 오류가 발생했습니다.",
      };
    }
  }

  public async updateMovie(
    movieId: number,
    updates: Partial<MovieDTO>
  ): Promise<ApiResponse<void>> {
    try {
      if (!movieId || movieId <= 0) {
        return {
          success: false,
          error: "올바른 영화 ID를 입력해주세요.",
        };
      }

      if (Object.keys(updates).length === 0) {
        return {
          success: false,
          error: "수정할 내용을 입력해주세요.",
        };
      }

      // 부분적 업데이트 데이터 검증
      if (updates.title !== undefined && !updates.title.trim()) {
        return {
          success: false,
          error: "영화 제목은 비워둘 수 없습니다.",
        };
      }

      if (updates.director !== undefined && !updates.director.trim()) {
        return {
          success: false,
          error: "감독 이름은 비워둘 수 없습니다.",
        };
      }

      if (
        updates.releaseYear !== undefined &&
        (updates.releaseYear < 1888 ||
          updates.releaseYear > new Date().getFullYear())
      ) {
        return {
          success: false,
          error: "올바른 개봉년도를 입력해주세요.",
        };
      }

      if (
        updates.genre !== undefined &&
        !Object.values(Genre).includes(updates.genre)
      ) {
        return {
          success: false,
          error: "올바른 장르를 선택해주세요.",
        };
      }

      if (
        updates.duration !== undefined &&
        (!updates.duration || updates.duration <= 0)
      ) {
        return {
          success: false,
          error: "올바른 상영시간을 입력해주세요.",
        };
      }

      await this.movieReviewService.updateMovie(movieId, updates);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "영화 수정 중 오류가 발생했습니다.",
      };
    }
  }
}
