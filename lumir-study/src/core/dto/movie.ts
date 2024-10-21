import { ReviewDTO } from "./../model/review";
import { MovieDTO } from "./../model/movie";

export class Movie implements MovieDTO {
  private _id: number;
  private _title: string;
  private _director: string;
  private _releaseYear: number;
  private _genre: string;
  private _reviews: ReviewDTO[] = [];

  constructor(movieDTO: MovieDTO) {
    this._id = movieDTO.id;
    this._title = movieDTO.title;
    this._director = movieDTO.director;
    this._releaseYear = movieDTO.releaseYear;
    this._genre = movieDTO.genre;
  }

  get id(): number {
    return this._id;
  }
  get title(): string {
    return this._title;
  }
  get director(): string {
    return this._director;
  }
  get releaseYear(): number {
    return this._releaseYear;
  }
  get genre(): string {
    return this._genre;
  }
  get reviews(): ReviewDTO[] {
    return this._reviews;
  }

  // ? 리뷰를 추가하는 메서드를 추가했습니다.
  addReview(reviewDTO: ReviewDTO) {
    // 평점이 1~5 사이의 값인지 확인합니다.
    if (reviewDTO.rating <= 0 || reviewDTO.rating > 5) {
      throw new Error("Rating must be between 1 and 5");
    }
    this._reviews.push(reviewDTO);
  }

  // ? 평균 평점을 반환하는 메서드를 추가했습니다.
  getAverageRating(): number {
    if (this._reviews.length === 0) {
      return 0;
    }

    const totalRating = this._reviews.reduce(
      (sum, review) => sum + review.rating,
      0
    );
    return Number((totalRating / this._reviews.length).toFixed(1));
  }

  // ? DTO를 반환하는 메서드를 추가했습니다.
  toDTO(): MovieDTO {
    return {
      id: this._id,
      title: this._title,
      director: this._director,
      releaseYear: this._releaseYear,
      genre: this._genre,
    };
  }

  // ? 가장 높은 평점을 가진 리뷰를 반환하는 메서드를 추가했습니다.
  getTopReviews(): ReviewDTO | null {
    if (this._reviews.length === 0) {
      return null;
    }
    return this._reviews.sort((a, b) => b.rating - a.rating)[0];
  }
}
