import { Movie } from "../dto/movie";
import { Review } from "../dto/review";
import { MovieDTO } from "../model/movie";
import { ReviewDTO } from "../model/review";

export class MovieReviewService {
  // ? 영화를 저장하는 맵을 추가했습니다.
  private movies: Map<number, Movie> = new Map();

  // ? 영화를 추가하는 메서드를 추가했습니다.
  addMovie(movieDTO: MovieDTO): void {
    const movie = new Movie(movieDTO);

    if (this.movies.has(movie.id)) {
      throw new Error("Movie already exists");
    }

    if (
      !movieDTO.title ||
      !movieDTO.director ||
      !movieDTO.releaseYear ||
      !movieDTO.genre
    ) {
      throw new Error("Invalid movie data");
    }

    this.movies.set(movie.id, movie);
  }

  // ? 리뷰를 추가하는 메서드를 추가했습니다.
  addReview(reviewDTO: ReviewDTO): void {
    const movie = this.movies.get(+reviewDTO.movieId);

    if (!movie) {
      throw new Error("Movie not found");
    }

    const review = new Review(reviewDTO);
    if (movie.reviews.find((r) => r.userId === review.userId)) {
      throw new Error("Review already exists");
    }

    movie.addReview(review);
  }

  // ? averageRating 프로퍼티를 추가했습니다.
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
      averageRating: movie.getAverageRating(),
    };
  }

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
}
