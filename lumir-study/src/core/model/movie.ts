import { ReviewDTO } from "../dto/review";
import { MovieDTO } from "../dto/movie";
import { Genre } from "../types/genre";

export class Movie implements MovieDTO {
  private _id: number;
  private _title: string;
  private _director: string;
  private _releaseYear: number;
  private _genre: string;
  private _duration: number;
  private _reviews: ReviewDTO[] = [];

  constructor(movieDTO: MovieDTO) {
    this._id = movieDTO.id;
    this._title = movieDTO.title;
    this._director = movieDTO.director;

    if (
      movieDTO.releaseYear < 1900 ||
      movieDTO.releaseYear > new Date().getFullYear()
    ) {
      throw new Error("Release year must be between 1900 and 2024");
    }
    this._releaseYear = movieDTO.releaseYear;

    if (!Movie.isValidGenre(movieDTO.genre)) {
      throw new Error("Invalid genre");
    }
    this._genre = movieDTO.genre;

    if (movieDTO.duration < 0) {
      throw new Error("Duration must be greater than 0");
    }

    this._duration = movieDTO.duration;
  }

  static fromDTO(movieDTO: MovieDTO): Movie {
    if (!Movie.validateMovieDTO(movieDTO)) {
      throw new Error("Invalid movie data");
    }

    return new Movie(movieDTO);
  }

  // Genre 유효성 검사 메서드 추가
  private static isValidGenre(genre: string): genre is Genre {
    return ["Action", "Comedy", "Drama", "Sci-Fi", "Horror"].includes(genre);
  }

  static validateMovieDTO(movieDTO: MovieDTO): boolean {
    if (
      !movieDTO.title ||
      !movieDTO.director ||
      !movieDTO.releaseYear ||
      !movieDTO.genre ||
      !movieDTO.duration ||
      !this.isValidGenre(movieDTO.genre)
    ) {
      return false;
    }

    return true;
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
  get duration(): number {
    return this._duration;
  }
  get reviews(): ReviewDTO[] {
    return this._reviews;
  }

  // ? 리뷰를 추가하는 메서드
  addReview(reviewDTO: ReviewDTO) {
    // 평점이 1~5 사이의 값인지 확인합니다.
    if (reviewDTO.rating <= 0 || reviewDTO.rating > 5) {
      throw new Error("Rating must be between 1 and 5");
    }

    if (this._reviews.find((review) => review.userId === reviewDTO.userId)) {
      throw new Error("User already has a review for this movie");
    }

    this._reviews.push(reviewDTO);
  }

  // ? 평균 평점을 반환하는 메서드
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

  // ? DTO를 반환하는 메서드
  toDTO(): MovieDTO {
    return {
      id: this._id,
      title: this._title,
      director: this._director,
      releaseYear: this._releaseYear,
      genre: this._genre,
      duration: this._duration,
    };
  }

  // ? 가장 높은 평점을 가진 리뷰를 반환하는 메서드
  getTopReviews(): ReviewDTO | null {
    if (this._reviews.length === 0) {
      return null;
    }

    const sortedReviews = [...this._reviews].sort((a, b) => {
      if (b.rating !== a.rating) {
        return b.rating - a.rating;
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    return sortedReviews[0];
  }

  // ? 영화 정보를 수정하는 메서드
  updateDetails(updates: Partial<MovieDTO>): void {
    // 입력받은 값만 검증
    if (
      updates.releaseYear !== undefined &&
      (updates.releaseYear < 1900 ||
        updates.releaseYear > new Date().getFullYear())
    ) {
      throw new Error("개봉 연도는 1900년부터 현재 연도 사이여야 합니다");
    }
    if (updates.genre !== undefined && !Movie.isValidGenre(updates.genre)) {
      throw new Error("유효하지 않은 장르입니다");
    }
    if (updates.duration !== undefined && updates.duration < 0) {
      throw new Error("상영 시간은 0보다 커야 합니다");
    }

    // 유효한 필드만 업데이트
    Object.keys(updates).forEach((key) => {
      if (key in this && updates[key] !== undefined) {
        this[`_${key}`] = updates[key];
      }
    });
  }

  getReviewsByRating(minRating: number, maxRating: number): ReviewDTO[] {
    return this._reviews.filter(
      (review) => review.rating >= minRating && review.rating <= maxRating
    );
  }
}
