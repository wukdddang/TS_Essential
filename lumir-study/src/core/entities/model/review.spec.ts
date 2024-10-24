import { Review } from "../model/review";
import { ReviewDTO } from "../../dto/review";
import { describe, expect, it } from "@jest/globals";

describe("Review", () => {
  const validReviewDTO: ReviewDTO = {
    id: "R1",
    movieId: 1,
    userId: 1,
    rating: 4,
    comment: "This is a valid comment",
    likes: 0,
    createdAt: new Date(),
  };

  describe("constructor", () => {
    it("should create a review instance with valid data", () => {
      const review = new Review(validReviewDTO);
      expect(review).toBeInstanceOf(Review);
      expect(review.id).toBe(validReviewDTO.id);
      expect(review.movieId).toBe(validReviewDTO.movieId);
      expect(review.userId).toBe(validReviewDTO.userId);
      expect(review.rating).toBe(validReviewDTO.rating);
      expect(review.comment).toBe(validReviewDTO.comment);
    });

    it("should throw error when rating is less than 0", () => {
      const invalidDTO = { ...validReviewDTO, rating: -1 };
      expect(() => new Review(invalidDTO)).toThrow(
        "Rating must be between 0 and 5"
      );
    });

    it("should throw error when rating is greater than 5", () => {
      const invalidDTO = { ...validReviewDTO, rating: 6 };
      expect(() => new Review(invalidDTO)).toThrow(
        "Rating must be between 0 and 5"
      );
    });

    it("should throw error when comment is too short", () => {
      const invalidDTO = { ...validReviewDTO, comment: "hi" };
      expect(() => new Review(invalidDTO)).toThrow(
        "Comment must be between 5 and 500 characters"
      );
    });

    it("should throw error when comment is too long", () => {
      const longComment = "a".repeat(501);
      const invalidDTO = { ...validReviewDTO, comment: longComment };
      expect(() => new Review(invalidDTO)).toThrow(
        "Comment must be between 5 and 500 characters"
      );
    });
  });

  describe("validateReviewDTO", () => {
    it("should return true for valid review data", () => {
      expect(Review.validateReviewDTO(validReviewDTO)).toBe(true);
    });

    it("should return false when movieId is missing", () => {
      const invalidDTO = { ...validReviewDTO, movieId: undefined };
      expect(Review.validateReviewDTO(invalidDTO)).toBe(false);
    });

    it("should return false when userId is missing", () => {
      const invalidDTO = { ...validReviewDTO, userId: undefined };
      expect(Review.validateReviewDTO(invalidDTO)).toBe(false);
    });

    it("should return false when comment is missing", () => {
      const invalidDTO = { ...validReviewDTO, comment: undefined };
      expect(Review.validateReviewDTO(invalidDTO)).toBe(false);
    });
  });

  describe("fromDTO", () => {
    it("should create a review instance from valid DTO", () => {
      const review = Review.fromDTO(validReviewDTO);
      expect(review).toBeInstanceOf(Review);
    });

    it("should throw error for invalid DTO", () => {
      const invalidDTO = { ...validReviewDTO, movieId: undefined };
      expect(() => Review.fromDTO(invalidDTO)).toThrow("Invalid review data");
    });
  });

  describe("updateComment", () => {
    it("should update comment with valid text", () => {
      const review = new Review(validReviewDTO);
      const newComment = "This is an updated comment";
      review.updateComment(newComment);
      expect(review.comment).toBe(newComment);
    });

    it("should throw error when new comment is too short", () => {
      const review = new Review(validReviewDTO);
      expect(() => review.updateComment("hi")).toThrow(
        "Comment must be between 5 and 500 characters"
      );
    });

    it("should throw error when new comment is too long", () => {
      const review = new Review(validReviewDTO);
      const longComment = "a".repeat(501);
      expect(() => review.updateComment(longComment)).toThrow(
        "Comment must be between 5 and 500 characters"
      );
    });
  });

  describe("addLike", () => {
    it("should increment likes count", () => {
      const review = new Review(validReviewDTO);
      const initialLikes = review.likes;
      review.addLike();
      expect(review.likes).toBe(initialLikes + 1);
    });
  });

  describe("isPositive", () => {
    it("should return true for ratings >= 4", () => {
      const review = new Review({ ...validReviewDTO, rating: 4 });
      expect(review.isPositive()).toBe(true);

      const review2 = new Review({ ...validReviewDTO, rating: 5 });
      expect(review2.isPositive()).toBe(true);
    });

    it("should return false for ratings < 4", () => {
      const review = new Review({ ...validReviewDTO, rating: 3 });
      expect(review.isPositive()).toBe(false);
    });
  });

  describe("summarize", () => {
    it("should return full comment when shorter than maxLength", () => {
      const review = new Review(validReviewDTO);
      const summary = review.summarize(100);
      expect(summary).toBe(validReviewDTO.comment);
    });

    it("should truncate comment with ellipsis when longer than maxLength", () => {
      const longComment =
        "This is a very long comment that needs to be truncated";
      const review = new Review({ ...validReviewDTO, comment: longComment });
      const maxLength = 20;
      const summary = review.summarize(maxLength);
      expect(summary).toBe(longComment.slice(0, maxLength) + "...");
      expect(summary.length).toBe(maxLength + 3); // including '...'
    });
  });

  describe("toDTO", () => {
    it("should convert Review instance to DTO", () => {
      const review = new Review(validReviewDTO);
      const dto = review.toDTO();

      expect(dto).toEqual({
        id: validReviewDTO.id,
        movieId: validReviewDTO.movieId,
        userId: validReviewDTO.userId,
        rating: validReviewDTO.rating,
        comment: validReviewDTO.comment,
        likes: validReviewDTO.likes,
        createdAt: validReviewDTO.createdAt,
      });
    });
  });
});
