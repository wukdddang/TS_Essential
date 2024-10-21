import { ReviewDTO } from "../model/review";

export class Review implements ReviewDTO {
  private _id: string;
  private _movieId: string;
  private _userId: string;
  private _rating: number;
  private _comment: string;
  private _likes: number = 0;

  constructor(reviewDTO: ReviewDTO) {
    this._id = reviewDTO.id;
    this._movieId = reviewDTO.movieId;
    this._userId = reviewDTO.userId;
    this._rating = reviewDTO.rating;
    this._comment = reviewDTO.comment;
  }

  get id(): string {
    return this._id;
  }
  get movieId(): string {
    return this._movieId;
  }
  get userId(): string {
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

  set likes(likes: number) {
    this._likes = likes;
  }

  updateComment(newComment: string): void {
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
    };
  }

  addLike(): void {
    this.likes++;
  }
}
