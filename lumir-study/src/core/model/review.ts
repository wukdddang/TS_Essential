import { ReviewDTO } from "../dto/review";

export class Review implements ReviewDTO {
  private _id: string;
  private _movieId: number;
  private _userId: number;
  private _rating: number;
  private _comment: string;
  private _likes: number = 0;
  private _createdAt: Date;

  constructor(reviewDTO: ReviewDTO) {
    this._id = reviewDTO.id;
    this._movieId = reviewDTO.movieId;
    this._userId = reviewDTO.userId;

    if (reviewDTO.rating <= 0 || reviewDTO.rating > 5) {
      throw new Error("Rating must be between 0 and 5");
    }
    this._rating = reviewDTO.rating;

    if (reviewDTO.comment.length < 5 || reviewDTO.comment.length > 500) {
      throw new Error("Comment must be between 5 and 500 characters");
    }
    this._comment = reviewDTO.comment;
    this._createdAt = reviewDTO.createdAt;
  }

  static validateReviewDTO(reviewDTO: ReviewDTO): boolean {
    if (!reviewDTO.movieId || !reviewDTO.userId || !reviewDTO.comment) {
      return false;
    }

    return true;
  }

  static fromDTO(reviewDTO: ReviewDTO): Review {
    if (!Review.validateReviewDTO(reviewDTO)) {
      throw new Error("Invalid review data");
    }

    return new Review(reviewDTO);
  }

  get id(): string {
    return this._id;
  }
  get movieId(): number {
    return this._movieId;
  }
  get userId(): number {
    return this._userId;
  }
  get rating(): number {
    return this._rating;
  }
  get comment(): string {
    return this._comment;
  }
  get likes(): number {
    return this._likes;
  }
  get createdAt(): Date {
    return this._createdAt;
  }

  set likes(likes: number) {
    this._likes = likes;
  }

  updateComment(newComment: string): void {
    if (newComment.length < 5 || newComment.length > 500) {
      throw new Error("Comment must be between 5 and 500 characters");
    }
    this._comment = newComment;
  }

  toDTO(): ReviewDTO {
    return {
      id: this._id,
      movieId: this._movieId,
      userId: this._userId,
      rating: this._rating,
      comment: this._comment,
      likes: this._likes,
      createdAt: this._createdAt,
    };
  }

  addLike(): void {
    this.likes++;
  }

  isPositive(): boolean {
    return this._rating >= 4;
  }

  summarize(maxLength: number): string {
    if (this._comment.length <= maxLength) {
      return this._comment;
    }

    return this._comment.slice(0, maxLength) + "...";
  }
}
