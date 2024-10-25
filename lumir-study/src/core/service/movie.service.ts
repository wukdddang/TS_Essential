// src/core/service/movie.service.ts
import { MovieDTO } from "../dto/movie";
import { Genre } from "../../types/genre";
import { Repository } from "../../interfaces/repository.interface";
import { Movie } from "../entities/model/movie";
import { ReviewService } from "./review.service";

export class MovieService {
  private static instance: MovieService;
  private _movieRepository: Repository<MovieDTO>;
  private _reviewService: ReviewService;

  private constructor(movieRepository: Repository<MovieDTO>) {
    this._movieRepository = movieRepository;
  }

  public static getInstance(
    movieRepository: Repository<MovieDTO>
  ): MovieService {
    if (!MovieService.instance) {
      MovieService.instance = new MovieService(movieRepository);
    }
    return MovieService.instance;
  }

  public setReviewService(reviewService: ReviewService): void {
    this._reviewService = reviewService;
  }

  async initialize(): Promise<void> {
    await this._movieRepository.initialize();
  }

  async addMovie(movieDTO: Omit<MovieDTO, "id">): Promise<MovieDTO> {
    const movies = await this._movieRepository.findAll();

    const isExistingMovie = movies.some(
      (movie) =>
        movie.title === movieDTO.title && movie.director === movieDTO.director
    );

    if (isExistingMovie) {
      throw new Error("Movie already exists");
    }

    if (!Movie.validateMovieDTO(movieDTO)) {
      throw new Error("Invalid movie data");
    }

    return await this._movieRepository.save(movieDTO);
  }

  async updateMovie(
    movieId: number,
    updates: Partial<MovieDTO>
  ): Promise<MovieDTO> {
    const movies = await this._movieRepository.findAll();
    const movieIndex = movies.findIndex((m) => m.id === movieId);

    if (movieIndex === -1) {
      throw new Error("Movie not found");
    }

    const updatedMovie = { ...movies[movieIndex], ...updates };

    if (!Movie.validateMovieDTO(updatedMovie)) {
      throw new Error("Invalid movie data");
    }

    await this._movieRepository.save(updatedMovie);
    return updatedMovie;
  }

  async getMovieById(movieId: number): Promise<MovieDTO> {
    const movie = await this._movieRepository.findById(movieId);

    if (!movie) {
      throw new Error("Movie not found");
    }

    return movie;
  }

  async getAllMovies(): Promise<MovieDTO[]> {
    return this._movieRepository.findAll();
  }

  async getMoviesByGenre(genre: Genre): Promise<MovieDTO[]> {
    const movies = await this._movieRepository.findAll();
    return movies.filter((movie) => movie.genre === genre);
  }

  async searchMovies(query: string): Promise<MovieDTO[]> {
    const movies = await this._movieRepository.findAll();
    const lowercaseQuery = query.toLowerCase();

    return movies.filter(
      (movie) =>
        movie.title.toLowerCase().includes(lowercaseQuery) ||
        movie.director.toLowerCase().includes(lowercaseQuery)
    );
  }

  async deleteMovie(movieId: number): Promise<void> {
    const movies = await this._movieRepository.findAll();
    const movieIndex = movies.findIndex((m) => m.id === movieId);

    if (movieIndex === -1) {
      throw new Error("Movie not found");
    }

    movies.splice(movieIndex, 1);
    await this._movieRepository.delete(movieId);
  }

  async getTopRatedMovies(n: number, minReviews: number): Promise<MovieDTO[]> {
    const movies = await this.getAllMovies();

    const moviesWithStats = await Promise.all(
      movies.map(async (movie) => {
        const stats = await this._reviewService.getMovieStats(movie.id);
        return {
          ...movie,
          averageRating: stats.averageRating,
          totalReviews: stats.totalReviews,
        };
      })
    );

    return moviesWithStats
      .filter((movie) => movie.totalReviews >= minReviews)
      .sort((a, b) => b.averageRating - a.averageRating)
      .slice(0, n);
  }

  async recommendMovies(userId: number, count: number): Promise<MovieDTO[]> {
    const [movies, reviews] = await Promise.all([
      this.getAllMovies(),
      this._reviewService.getReviewsByUserId(userId),
    ]);

    // 사용자의 높은 평점 리뷰 필터링 (4점 이상)
    const highRatedReviews = reviews.filter((review) => review.rating >= 4);

    if (highRatedReviews.length === 0) {
      // 사용자의 리뷰가 없거나 높은 평점이 없는 경우 전체 인기 영화 추천
      return this.getTopRatedMovies(count, 3);
    }

    // 사용자가 이미 본 영화들
    const watchedMovieIds = new Set(reviews.map((review) => review.movieId));

    // 선호 장르 분석
    const genrePreferences = this.analyzeGenrePreferences(
      highRatedReviews,
      movies
    );

    // 추천 점수 계산 및 영화 정렬
    const recommendedMovies = await this.calculateMovieScores(
      movies,
      watchedMovieIds,
      genrePreferences
    );

    return recommendedMovies.slice(0, count);
  }

  private analyzeGenrePreferences(
    highRatedReviews: Array<{ movieId: number; rating: number }>,
    movies: MovieDTO[]
  ): Map<Genre, number> {
    const genrePreferences = new Map<
      Genre,
      { count: number; totalRating: number }
    >();

    highRatedReviews.forEach((review) => {
      const movie = movies.find((m) => m.id === review.movieId);
      if (movie) {
        const current = genrePreferences.get(movie.genre) || {
          count: 0,
          totalRating: 0,
        };
        genrePreferences.set(movie.genre, {
          count: current.count + 1,
          totalRating: current.totalRating + review.rating,
        });
      }
    });

    // 장르별 선호도 점수 계산 (0~1 사이 값)
    const preferences = new Map<Genre, number>();
    genrePreferences.forEach((value, genre) => {
      preferences.set(genre, value.totalRating / (value.count * 5)); // 5는 최대 평점
    });

    return preferences;
  }

  private async calculateMovieScores(
    movies: MovieDTO[],
    watchedMovieIds: Set<number>,
    genrePreferences: Map<Genre, number>
  ): Promise<MovieDTO[]> {
    const moviesWithScores = await Promise.all(
      movies
        .filter((movie) => !watchedMovieIds.has(movie.id))
        .map(async (movie) => {
          const stats = await this._reviewService.getMovieStats(movie.id);
          const genreScore = genrePreferences.get(movie.genre) || 0;

          // 추천 점수 계산: 장르 선호도(0.6) + 평균 평점(0.4)
          const recommendationScore =
            genreScore * 0.6 + (stats.averageRating / 5) * 0.4; // 평점도 0~1 사이 값으로 정규화

          return {
            ...movie,
            recommendationScore,
          };
        })
    );

    return moviesWithScores.sort(
      (a, b) => b.recommendationScore - a.recommendationScore
    );
  }

  async getMovieStats(movieId: number): Promise<{
    totalReviews: number;
    averageRating: number;
    positivePercentage: number;
  } | null> {
    const movie = await this.getMovieById(movieId);
    if (!movie) {
      return null;
    }

    const stats = await this._reviewService.getMovieStats(movieId);
    return stats;
  }
}
