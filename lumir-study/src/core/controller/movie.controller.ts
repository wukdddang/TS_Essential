import { MovieDTO } from "../dto/movie";
import { MovieService } from "../service/movie.service";
import { Genre } from "../../types/genre";
import { ApiResponse } from "../../interfaces/api-response.interface";

export class MovieController {
  private static instance: MovieController;
  private movieService: MovieService;

  private constructor(movieService: MovieService) {
    this.movieService = movieService;
  }

  public static getInstance(movieService: MovieService): MovieController {
    if (!MovieController.instance) {
      MovieController.instance = new MovieController(movieService);
    }
    return MovieController.instance;
  }

  private validateMovieInput(movieDTO: Omit<MovieDTO, "id">): string | null {
    if (!movieDTO.title?.trim()) {
      return "영화 제목은 필수입니다.";
    }
    if (!movieDTO.director?.trim()) {
      return "감독 이름은 필수입니다.";
    }
    if (
      !movieDTO.releaseYear ||
      movieDTO.releaseYear < 1888 ||
      movieDTO.releaseYear > new Date().getFullYear()
    ) {
      return "올바른 개봉년도를 입력해주세요.";
    }
    if (!Object.values(Genre).includes(movieDTO.genre)) {
      return "올바른 장르를 선택해주세요.";
    }
    if (!movieDTO.duration || movieDTO.duration <= 0) {
      return "올바른 상영시간을 입력해주세요.";
    }
    return null;
  }

  public async addMovie(
    movieDTO: Omit<MovieDTO, "id">
  ): Promise<ApiResponse<MovieDTO>> {
    try {
      const validationError = this.validateMovieInput(movieDTO);
      if (validationError) {
        return {
          success: false,
          error: validationError,
        };
      }

      // console.log("movieDTO", movieDTO);
      const response = await this.movieService.addMovie(movieDTO);

      return { success: true, data: response };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "영화 추가 중 오류가 발생했습니다.",
      };
    }
  }

  public async getMovie(movieId: number): Promise<ApiResponse<MovieDTO>> {
    const movie = await this.movieService.getMovieById(movieId);
    return { success: true, data: movie };
  }

  public async getTopRatedMovies(
    n: number,
    minReviews: number
  ): Promise<ApiResponse<MovieDTO[]>> {
    try {
      const movies = await this.movieService.getTopRatedMovies(n, minReviews);
      return { success: true, data: movies };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "상위 평점 영화 조회 중 오류가 발생했습니다.",
      };
    }
  }

  public async getMoviesByGenre(
    genre: Genre
  ): Promise<ApiResponse<MovieDTO[]>> {
    try {
      const movies = await this.movieService.getMoviesByGenre(genre);
      return { success: true, data: movies };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "장르별 영화 조회 중 오류가 발생했습니다.",
      };
    }
  }

  public async getMovieStats(movieId: number): Promise<
    ApiResponse<{
      totalReviews: number;
      averageRating: number;
      positivePercentage: number;
    } | null>
  > {
    try {
      if (!movieId || movieId <= 0) {
        return {
          success: false,
          error: "올바른 영화 ID를 입력해주세요.",
        };
      }

      const stats = await this.movieService.getMovieStats(movieId);
      return { success: true, data: stats };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "통계 조회 중 오류가 발생했습니다.",
      };
    }
  }

  public async searchMovies(query: string): Promise<ApiResponse<MovieDTO[]>> {
    try {
      if (!query?.trim()) {
        return {
          success: false,
          error: "검색어를 입력해주세요.",
        };
      }

      const movies = await this.movieService.searchMovies(query);
      return {
        success: true,
        data: movies,
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "영화 검색 중 오류가 발생했습니다.",
      };
    }
  }

  public async updateMovie(
    movieId: number,
    updates: Partial<MovieDTO>
  ): Promise<ApiResponse<void>> {
    try {
      if (!movieId || movieId <= 0) {
        return {
          success: false,
          error: "올바른 영화 ID를 입력해주세요.",
        };
      }

      if (Object.keys(updates).length === 0) {
        return {
          success: false,
          error: "수정할 내용을 입력해주세요.",
        };
      }

      if (updates.title !== undefined && !updates.title.trim()) {
        return {
          success: false,
          error: "영화 제목은 비워둘 수 없습니다.",
        };
      }

      if (updates.director !== undefined && !updates.director.trim()) {
        return {
          success: false,
          error: "감독 이름은 비워둘 수 없습니다.",
        };
      }

      if (
        updates.releaseYear !== undefined &&
        (updates.releaseYear < 1888 ||
          updates.releaseYear > new Date().getFullYear())
      ) {
        return {
          success: false,
          error: "올바른 개봉년도를 입력해주세요.",
        };
      }

      if (
        updates.genre !== undefined &&
        !Object.values(Genre).includes(updates.genre)
      ) {
        return {
          success: false,
          error: "올바른 장르를 선택해주세요.",
        };
      }

      if (
        updates.duration !== undefined &&
        (!updates.duration || updates.duration <= 0)
      ) {
        return {
          success: false,
          error: "올바른 상영시간을 입력해주세요.",
        };
      }

      await this.movieService.updateMovie(movieId, updates);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "영화 수정 중 오류가 발생했습니다.",
      };
    }
  }

  public async recommendMovies(
    userId: number,
    count: number
  ): Promise<ApiResponse<MovieDTO[]>> {
    const recommendedMovies = await this.movieService.recommendMovies(
      userId,
      count
    );
    return { success: true, data: recommendedMovies };
  }
}
