import { ApiResponse } from "../../interfaces/api-response.interface";
import { ReviewDTO } from "../dto/review";
import { ReviewService } from "../service/review.service";

export class ReviewController {
  private static instance: ReviewController;
  private reviewService: ReviewService;

  private constructor(reviewService: ReviewService) {
    this.reviewService = reviewService;
  }

  public static getInstance(reviewService: ReviewService): ReviewController {
    if (!ReviewController.instance) {
      ReviewController.instance = new ReviewController(reviewService);
    }
    return ReviewController.instance;
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

      await this.reviewService.addReview(reviewDTO);
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

  public async updateReview(
    reviewId: string,
    comment: string
  ): Promise<ApiResponse<void>> {
    try {
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

      await this.reviewService.updateReview(reviewId, comment);
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

      await this.reviewService.addLike(movieId, reviewId);
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

      const reviews = await this.reviewService.getReviewsByRating(
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

      const review = await this.reviewService.getMostLikedReview(movieId);
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

      const reviewers = await this.reviewService.getUserTopReviewers(count);
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

  public async getMovieReviews(
    movieId: number
  ): Promise<ApiResponse<ReviewDTO[]>> {
    const reviews = await this.reviewService.getReviewsByMovieId(movieId);
    return { success: true, data: reviews };
  }
}
