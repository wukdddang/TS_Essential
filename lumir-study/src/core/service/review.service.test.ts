import { ReviewService } from "./review.service";
import { MovieService } from "./movie.service";
import { Repository } from "../../interfaces/repository.interface";
import { ReviewDTO } from "../dto/review";
import { Genre } from "../../types/genre";

describe("ReviewService", () => {
  let reviewService: ReviewService;
  let mockReviewRepository: jest.Mocked<Repository<ReviewDTO>>;
  let mockMovieService: jest.Mocked<MovieService>;

  const mockReview: Omit<ReviewDTO, "id"> = {
    movieId: 1,
    userId: 1,
    rating: 4,
    comment: "Great movie!",
    likes: 0,
    createdAt: new Date(),
  };

  beforeEach(() => {
    mockReviewRepository = {
      initialize: jest.fn(),
      findAll: jest.fn(),
      save: jest.fn(),
    } as any;

    mockMovieService = {
      getMovieById: jest.fn(),
    } as any;

    reviewService = ReviewService.getInstance(mockReviewRepository);
    reviewService.setMovieService(mockMovieService);
  });

  describe("addReview", () => {
    it("should add a new review successfully", async () => {
      mockMovieService.getMovieById.mockResolvedValue({
        id: 1,
        title: "Test Movie",
        director: "Test Director",
        releaseYear: 2024,
        genre: "Test Genre" as Genre,
        duration: 120,
      });
      mockReviewRepository.findAll.mockResolvedValue([]);
      mockReviewRepository.save.mockResolvedValue({ ...mockReview, id: "1" });

      const result = await reviewService.addReview(mockReview);

      expect(result).toEqual({ ...mockReview, id: "1" });
      expect(mockReviewRepository.save).toHaveBeenCalledWith(mockReview);
    });

    it("should throw error if user has already reviewed the movie", async () => {
      mockMovieService.getMovieById.mockResolvedValue({
        id: 1,
        title: "Test Movie",
        director: "Test Director",
        releaseYear: 2024,
        genre: "Test Genre" as Genre,
        duration: 120,
      });
      mockReviewRepository.findAll.mockResolvedValue([
        { ...mockReview, id: "1" },
      ]);

      await expect(reviewService.addReview(mockReview)).rejects.toThrow(
        "User has already reviewed this movie"
      );
    });
  });

  describe("updateReview", () => {
    it("should update review comment successfully", async () => {
      const existingReview = { ...mockReview, id: "1" };
      const updatedComment = "Updated comment";
      mockReviewRepository.findAll.mockResolvedValue([existingReview]);
      mockReviewRepository.save.mockResolvedValue({
        ...existingReview,
        comment: updatedComment,
      });

      const result = await reviewService.updateReview("1", updatedComment);

      expect(result.comment).toBe(updatedComment);
      expect(mockReviewRepository.save).toHaveBeenCalled();
    });

    it("should throw error if review not found", async () => {
      mockReviewRepository.findAll.mockResolvedValue([]);

      await expect(
        reviewService.updateReview("1", "Updated comment")
      ).rejects.toThrow("Review not found");
    });
  });

  describe("addLike", () => {
    it("should increment likes count", async () => {
      const existingReview = { ...mockReview, id: "1", likes: 0 };
      mockReviewRepository.findAll.mockResolvedValue([existingReview]);
      mockReviewRepository.save.mockResolvedValue({
        ...existingReview,
        likes: 1,
      });

      const result = await reviewService.addLike(1, "1");

      expect(result.likes).toBe(1);
      expect(mockReviewRepository.save).toHaveBeenCalled();
    });

    it("should throw error if review not found", async () => {
      mockReviewRepository.findAll.mockResolvedValue([]);

      await expect(reviewService.addLike(1, "1")).rejects.toThrow(
        "Review not found"
      );
    });
  });

  describe("getReviewsByMovieId", () => {
    it("should return reviews for specific movie", async () => {
      const reviews = [
        { ...mockReview, id: "1", movieId: 1 },
        { ...mockReview, id: "2", movieId: 2 },
        { ...mockReview, id: "3", movieId: 1 },
      ];
      mockReviewRepository.findAll.mockResolvedValue(reviews);

      const result = await reviewService.getReviewsByMovieId(1);

      expect(result).toHaveLength(2);
      expect(result.every((review) => review.movieId === 1)).toBe(true);
    });
  });

  describe("getMostLikedReview", () => {
    it("should return review with most likes", async () => {
      const reviews = [
        { ...mockReview, id: "1", likes: 5 },
        { ...mockReview, id: "2", likes: 10 },
        { ...mockReview, id: "3", likes: 3 },
      ];
      mockReviewRepository.findAll.mockResolvedValue(reviews);

      const result = await reviewService.getMostLikedReview(1);

      expect(result?.id).toBe("2");
      expect(result?.likes).toBe(10);
    });

    it("should return null if no reviews exist", async () => {
      mockReviewRepository.findAll.mockResolvedValue([]);

      const result = await reviewService.getMostLikedReview(1);

      expect(result).toBeNull();
    });
  });

  describe("getMovieStats", () => {
    it("should calculate correct statistics", async () => {
      const reviews = [
        { ...mockReview, id: "1", rating: 4 },
        { ...mockReview, id: "2", rating: 5 },
        { ...mockReview, id: "3", rating: 3 },
      ];
      mockReviewRepository.findAll.mockResolvedValue(reviews);

      const result = await reviewService.getMovieStats(1);

      expect(result).toEqual({
        totalReviews: 3,
        averageRating: 4,
        positivePercentage: 66.66666666666667,
      });
    });

    it("should return zero values for movie with no reviews", async () => {
      mockReviewRepository.findAll.mockResolvedValue([]);

      const result = await reviewService.getMovieStats(1);

      expect(result).toEqual({
        totalReviews: 0,
        averageRating: 0,
        positivePercentage: 0,
      });
    });
  });

  describe("getTopRatedMovies", () => {
    it("should return top rated movies meeting minimum review criteria", async () => {
      const reviews = [
        { ...mockReview, id: "1", movieId: 1, rating: 5 },
        { ...mockReview, id: "2", movieId: 1, rating: 5 },
        { ...mockReview, id: "3", movieId: 2, rating: 4 },
        { ...mockReview, id: "4", movieId: 3, rating: 3 },
        { ...mockReview, id: "5", movieId: 3, rating: 3 },
      ];
      mockReviewRepository.findAll.mockResolvedValue(reviews);

      const result = await reviewService.getTopRatedMovies(2, 2);

      expect(result).toHaveLength(2);
      expect(result[0].movieId).toBe(1);
      expect(result[0].averageRating).toBe(5);
      expect(result[1].movieId).toBe(3);
      expect(result[1].averageRating).toBe(3);
    });
  });
});
