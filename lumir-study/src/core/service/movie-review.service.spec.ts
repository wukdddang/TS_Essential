import { Movie } from "../model/movie";
import type { MovieDTO } from "../dto/movie";
import type { ReviewDTO } from "../dto/review";
import type { Genre } from "../types/genre";

describe("Movie", () => {
  const mockDate = new Date("2024-01-01");

  const validMovieDTO: MovieDTO = {
    id: 1,
    title: "Inception",
    director: "Christopher Nolan",
    releaseYear: 2010,
    genre: "Sci-Fi",
    duration: 148,
  } as const;

  const validReviewDTO: ReviewDTO = {
    id: "R1",
    movieId: 1,
    userId: 1,
    rating: 4,
    comment: "Great movie!",
    likes: 0,
    createdAt: mockDate,
  } as const;

  describe("constructor & validation", () => {
    it("should create a movie instance with valid data", () => {
      const movie = new Movie(validMovieDTO);
      expect(movie).toBeInstanceOf(Movie);
      expect(movie.id).toBe(validMovieDTO.id);
      expect(movie.title).toBe(validMovieDTO.title);
      expect(movie.director).toBe(validMovieDTO.director);
      expect(movie.releaseYear).toBe(validMovieDTO.releaseYear);
      expect(movie.genre).toBe(validMovieDTO.genre);
      expect(movie.duration).toBe(validMovieDTO.duration);
    });

    it("should throw error for invalid release year (too early)", () => {
      const invalidDTO = { ...validMovieDTO, releaseYear: 1899 };
      expect(() => new Movie(invalidDTO)).toThrow(
        "Release year must be between 1900 and 2024"
      );
    });

    it("should throw error for invalid release year (future)", () => {
      const invalidDTO = {
        ...validMovieDTO,
        releaseYear: new Date().getFullYear() + 1,
      };
      expect(() => new Movie(invalidDTO)).toThrow(
        "Release year must be between 1900 and 2024"
      );
    });

    it("should throw error for invalid genre", () => {
      const invalidDTO = { ...validMovieDTO, genre: "Invalid" };
      expect(() => new Movie(invalidDTO)).toThrow("Invalid genre");
    });

    it("should throw error for negative duration", () => {
      const invalidDTO = { ...validMovieDTO, duration: -1 };
      expect(() => new Movie(invalidDTO)).toThrow(
        "Duration must be greater than 0"
      );
    });
  });

  describe("fromDTO", () => {
    it("should create a movie instance from valid DTO", () => {
      const movie = Movie.fromDTO(validMovieDTO);
      expect(movie).toBeInstanceOf(Movie);
    });

    it("should throw error for invalid DTO", () => {
      const invalidDTO = { ...validMovieDTO, title: "" };
      expect(() => Movie.fromDTO(invalidDTO)).toThrow("Invalid movie data");
    });
  });

  describe("validateMovieDTO", () => {
    it("should return true for valid movie data", () => {
      expect(Movie.validateMovieDTO(validMovieDTO)).toBe(true);
    });

    it("should return false when required fields are missing", () => {
      const invalidDTOs = [
        { ...validMovieDTO, title: "" },
        { ...validMovieDTO, director: "" },
        { ...validMovieDTO, releaseYear: undefined },
        { ...validMovieDTO, genre: "" },
        { ...validMovieDTO, duration: undefined },
      ];

      invalidDTOs.forEach((dto) => {
        expect(Movie.validateMovieDTO(dto)).toBe(false);
      });
    });
  });

  describe("addReview", () => {
    it("should add a valid review", () => {
      const movie = new Movie(validMovieDTO);
      movie.addReview(validReviewDTO);
      expect(movie.reviews).toHaveLength(1);
      expect(movie.reviews[0]).toEqual(validReviewDTO);
    });

    it("should throw error for invalid rating", () => {
      const movie = new Movie(validMovieDTO);
      const invalidReview = { ...validReviewDTO, rating: 6 };
      expect(() => movie.addReview(invalidReview)).toThrow(
        "Rating must be between 1 and 5"
      );
    });

    it("should throw error for duplicate user review", () => {
      const movie = new Movie(validMovieDTO);
      movie.addReview(validReviewDTO);
      expect(() => movie.addReview(validReviewDTO)).toThrow(
        "User already has a review for this movie"
      );
    });
  });

  describe("getAverageRating", () => {
    it("should return 0 for movie with no reviews", () => {
      const movie = new Movie(validMovieDTO);
      expect(movie.getAverageRating()).toBe(0);
    });

    it("should calculate correct average rating", () => {
      const movie = new Movie(validMovieDTO);
      const reviews = [
        { ...validReviewDTO, rating: 4, userId: 1 },
        { ...validReviewDTO, rating: 5, userId: 2 },
        { ...validReviewDTO, rating: 3, userId: 3 },
      ];

      reviews.forEach((review) => movie.addReview(review));
      expect(movie.getAverageRating()).toBe(4);
    });
  });

  describe("getTopReviews", () => {
    it("should return null for movie with no reviews", () => {
      const movie = new Movie(validMovieDTO);
      expect(movie.getTopReviews()).toBeNull();
    });

    it("should return review with highest rating", () => {
      const movie = new Movie(validMovieDTO);
      const reviews = [
        { ...validReviewDTO, rating: 3, userId: 1 },
        { ...validReviewDTO, rating: 5, userId: 2 },
        { ...validReviewDTO, rating: 4, userId: 3 },
      ];

      reviews.forEach((review) => movie.addReview(review));
      const topReview = movie.getTopReviews();
      expect(topReview.rating).toBe(5);
      expect(topReview.userId).toBe(2);
    });

    it("should prioritize newer reviews when ratings are equal", () => {
      const movie = new Movie(validMovieDTO);
      const reviews = [
        {
          ...validReviewDTO,
          rating: 5,
          userId: 1,
          createdAt: new Date("2024-01-01"),
        },
        {
          ...validReviewDTO,
          rating: 5,
          userId: 2,
          createdAt: new Date("2024-01-02"),
        },
      ];

      reviews.forEach((review) => movie.addReview(review));
      const topReview = movie.getTopReviews();
      expect(topReview?.userId).toBe(2);
    });
  });

  describe("updateDetails", () => {
    it("should update valid fields", () => {
      const movie = new Movie(validMovieDTO);
      const updates = {
        title: "Updated Title",
        director: "Updated Director",
        releaseYear: 2020,
        genre: "Action" as Genre,
        duration: 160,
      };

      movie.updateDetails(updates);
      expect(movie.title).toBe(updates.title);
      expect(movie.director).toBe(updates.director);
      expect(movie.releaseYear).toBe(updates.releaseYear);
      expect(movie.genre).toBe(updates.genre);
      expect(movie.duration).toBe(updates.duration);
    });

    it("should throw error for invalid release year", () => {
      const movie = new Movie(validMovieDTO);
      expect(() => movie.updateDetails({ releaseYear: 1899 })).toThrow(
        "개봉 연도는 1900년부터 현재 연도 사이여야 합니다"
      );
    });

    it("should throw error for invalid genre", () => {
      const movie = new Movie(validMovieDTO);
      expect(() => movie.updateDetails({ genre: "Invalid" })).toThrow(
        "유효하지 않은 장르입니다"
      );
    });

    it("should throw error for negative duration", () => {
      const movie = new Movie(validMovieDTO);
      expect(() => movie.updateDetails({ duration: -1 })).toThrow(
        "상영 시간은 0보다 커야 합니다"
      );
    });
  });

  describe("getReviewsByRating", () => {
    it("should return reviews within rating range", () => {
      const movie = new Movie(validMovieDTO);
      const reviews = [
        { ...validReviewDTO, rating: 3, userId: 1 },
        { ...validReviewDTO, rating: 4, userId: 2 },
        { ...validReviewDTO, rating: 5, userId: 3 },
        { ...validReviewDTO, rating: 2, userId: 4 },
      ];

      reviews.forEach((review) => movie.addReview(review));

      const filteredReviews = movie.getReviewsByRating(3, 4);
      expect(filteredReviews).toHaveLength(2);
      expect(filteredReviews.every((r) => r.rating >= 3 && r.rating <= 4)).toBe(
        true
      );
    });

    it("should return empty array when no reviews match criteria", () => {
      const movie = new Movie(validMovieDTO);
      const reviews = [
        { ...validReviewDTO, rating: 1, userId: 1 },
        { ...validReviewDTO, rating: 2, userId: 2 },
      ];

      reviews.forEach((review) => movie.addReview(review));

      const filteredReviews = movie.getReviewsByRating(3, 5);
      expect(filteredReviews).toHaveLength(0);
    });
  });

  describe("toDTO", () => {
    it("should convert Movie instance to DTO", () => {
      const movie = new Movie(validMovieDTO);
      const dto = movie.toDTO();

      expect(dto).toEqual(validMovieDTO);
    });

    it("should not include reviews in DTO", () => {
      const movie = new Movie(validMovieDTO);
      movie.addReview(validReviewDTO);

      const dto = movie.toDTO();
      expect(dto).not.toHaveProperty("reviews");
    });
  });
});
