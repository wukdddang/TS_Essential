import { MovieController } from "./core/controller/movie.controller";
import { ReviewController } from "./core/controller/review.controller";
import { MovieDTO } from "./core/dto/movie";
import { ReviewDTO } from "./core/dto/review";
import { MovieService } from "./core/service/movie.service";
import { ReviewService } from "./core/service/review.service";
import { FileRepository } from "./repositories/file.repository";
import { Genre } from "./types/genre";

export interface ApplicationDependencies {
  movieController: MovieController;
  reviewController: ReviewController;
  movieService: MovieService;
  reviewService: ReviewService;
  movieRepository: FileRepository<MovieDTO>;
  reviewRepository: FileRepository<ReviewDTO>;
}

export class Application {
  private static instance: Application;
  private movieController: MovieController;
  private reviewController: ReviewController;

  private constructor(dependencies: ApplicationDependencies) {
    this.movieController = dependencies.movieController;
    this.reviewController = dependencies.reviewController;
  }

  public static getInstance(
    dependencies: ApplicationDependencies
  ): Application {
    if (!Application.instance) {
      Application.instance = new Application(dependencies);
    }
    return Application.instance;
  }

  public async initialize(): Promise<void> {
    try {
      console.log("영화 리뷰 서비스가 초기화되었습니다.");
      this.promptUser();
    } catch (error) {
      console.error("서비스 초기화 중 오류 발생:", error);
      process.exit(1);
    }
  }

  private promptUser(): void {
    console.log(
      "명령어를 입력하세요 (1. 영화 추가, 2. 영화 상세수정, 3. 리뷰추가, 4. 영화 조회, 5. 좋아요 누르기, 6. 영화 검색, 7. 리뷰 수가 가장 많은 사용자 보기, 8. 영화 추천, 9. 평점 순위권 영화 보기, 10. 리뷰 수정하기, 11. 장르별 영화 보기, 12.종료): \n"
    );

    process.stdin.once("data", (input) => {
      const command = input.toString().trim();
      this.handleCommand(command);
    });
  }

  private handleCommand(command: string): void {
    switch (command) {
      case "1":
        this.addMovie();
        break;
      case "2":
        this.updateMovie();
        break;
      case "3":
        this.addReview();
        break;
      case "4":
        this.getMovie();
        break;
      case "5":
        this.addLike();
        break;
      case "6":
        this.searchMovies();
        break;
      case "7":
        this.getUserTopReviewers();
        break;
      case "8":
        this.recommendMovies();
        break;
      case "9":
        this.getTopRatedMovies();
        break;
      case "10":
        this.updateReview();
        break;
      case "11":
        this.getMoviesByGenre();
        break;
      case "12":
        process.exit(0);
      default:
        console.log("잘못된 명령어입니다. \n");
        this.promptUser();
    }
  }

  private getMovie(): void {
    console.log("조회할 영화 ID를 입력하세요: \n");
    process.stdin.once("data", async (movieIdInput) => {
      try {
        const movieId = parseInt(movieIdInput.toString().trim());
        const movieResponse = await this.movieController.getMovie(movieId);
        const reviewsResponse = await this.reviewController.getMovieReviews(
          movieId
        );

        if (movieResponse.success && reviewsResponse.success) {
          console.log("1. 모든 리뷰 보기");
          console.log("2. 가장 인기 있는 리뷰 보기");
          console.log("3. 돌아가기");
          console.log("옵션을 선택하세요 (1 또는 2 또는 3): ");

          process.stdin.once("data", async (optionInput) => {
            const option = parseInt(optionInput.toString().trim());

            switch (option) {
              case 1:
                console.log({
                  movie: movieResponse.data,
                  reviews: reviewsResponse.data,
                });
                break;
              case 2:
                const topReview =
                  await this.reviewController.getMostLikedReview(movieId);
                if (topReview.success && topReview.data) {
                  console.log(
                    `가장 인기 있는 리뷰: ${topReview.data.comment} (좋아요: ${topReview.data.likes}) \n`
                  );
                } else {
                  console.log(topReview.error || "리뷰가 없습니다. \n");
                }
                break;
              case 3:
                break;
              default:
                console.log("잘못된 옵션을 선택하셨습니다. \n");
            }
            this.promptUser();
          });
        } else {
          console.log(movieResponse.error || reviewsResponse.error);
          this.promptUser();
        }
      } catch (error) {
        console.error("영화 조회 실패:", error.message, "\n");
        this.promptUser();
      }
    });
  }

  private addMovie(): void {
    console.log(
      "영화 정보를 입력하세요 (제목,감독,개봉년도,장르,상영시간): \n"
    );
    console.log(
      "장르는 Action, Comedy, Drama, Sci-Fi, Horror 중 하나여야 합니다. \n"
    );
    process.stdin.once("data", async (input) => {
      try {
        const [title, director, releaseYear, genre, duration] = input
          .toString()
          .trim()
          .split(",");

        const movieDTO: Omit<MovieDTO, "id"> = {
          title,
          director,
          releaseYear: parseInt(releaseYear),
          genre: genre as Genre,
          duration: parseInt(duration),
        };

        const response = await this.movieController.addMovie(movieDTO);
        console.log(response);
        if (response.success) {
          console.log("영화가 추가되었습니다.");
        } else {
          console.log(response.error);
        }
      } catch (error) {
        console.error("영화 추가 실패:", error.message, "\n");
      } finally {
        this.promptUser();
      }
    });
  }

  private addReview(): void {
    console.log("리뷰 정보를 입력하세요 (영화ID,사용자ID,평점,코멘트): \n");
    process.stdin.once("data", async (input) => {
      try {
        const [movieId, userId, rating, comment] = input
          .toString()
          .trim()
          .split(",");

        const reviewDTO: Omit<ReviewDTO, "id"> = {
          movieId: parseInt(movieId),
          userId: parseInt(userId),
          rating: parseInt(rating),
          comment,
          likes: 0,
          createdAt: new Date(),
        };

        const response = await this.reviewController.addReview(reviewDTO);
        if (response.success) {
          console.log("리뷰가 추가되었습니다. \n");
        } else {
          console.error("리뷰 추가 실패:", response.error, "\n");
        }
      } catch (error) {
        console.error(
          "리뷰 추가 실패:",
          error instanceof Error ? error.message : "알 수 없는 오류",
          "\n"
        );
      } finally {
        this.promptUser();
      }
    });
  }

  private updateMovie(): void {
    console.log("수정할 영화 ID를 입력하세요: \n");
    process.stdin.once("data", async (movieIdInput) => {
      try {
        const movieId = parseInt(movieIdInput.toString().trim());
        const movieResponse = await this.movieController.getMovie(movieId);

        if (!movieResponse.success) {
          throw new Error(
            movieResponse.error || "해당 ID의 영화를 찾을 수 없습니다. \n"
          );
        }

        console.log(
          "수정할 영화 정보를 입력하세요 (제목,감독,개봉년도,장르,상영시간): \n"
        );

        process.stdin.once("data", async (input) => {
          const [title, director, releaseYear, genre, duration] = input
            .toString()
            .trim()
            .split(",");

          const movieDTO: Partial<MovieDTO> = {};
          if (title) movieDTO.title = title;
          if (director) movieDTO.director = director;
          if (releaseYear) movieDTO.releaseYear = parseInt(releaseYear);
          if (genre) movieDTO.genre = genre as Genre;
          if (duration) movieDTO.duration = parseInt(duration);

          const updateResponse = await this.movieController.updateMovie(
            movieId,
            movieDTO
          );
          if (updateResponse.success) {
            console.log("영화 정보가 성공적으로 수정되었습니다. \n");
          } else {
            console.error("영화 정보 수정 실패:", updateResponse.error, "\n");
          }
          this.promptUser();
        });
      } catch (error) {
        console.error("영화 수정 실패:", error.message, "\n");
        this.promptUser();
      }
    });
  }

  private async addLike(): Promise<void> {
    console.log("좋아요를 누를 영화 ID와 리뷰 ID를 입력하세요: \n");
    process.stdin.once("data", async (input) => {
      try {
        const [movieId, reviewId] = input.toString().trim().split(",");
        const response = await this.reviewController.addLike(
          parseInt(movieId),
          reviewId
        );

        if (response.success) {
          console.log("좋아요가 성공적으로 추가되었습니다. \n");
        } else {
          console.error("좋아요 추가 실패:", response.error, "\n");
        }
      } catch (error) {
        console.error(
          "좋아요 추가 실패:",
          error instanceof Error ? error.message : "알 수 없는 오류",
          "\n"
        );
      } finally {
        this.promptUser();
      }
    });
  }

  private searchMovies(): void {
    console.log("검색할 영화 제목 또는 감독을 입력하세요: \n");
    process.stdin.once("data", async (input) => {
      const query = input.toString().trim();
      const results = await this.movieController.searchMovies(query);
      console.log(results);
      this.promptUser();
    });
  }

  private getUserTopReviewers(): void {
    console.log(
      "리뷰 수가 가장 많은 N명의 사용자를 보려면 숫자를 입력하세요: \n"
    );
    process.stdin.once("data", async (input) => {
      const n = parseInt(input.toString().trim());
      const topReviewers = await this.reviewController.getUserTopReviewers(n);
      console.log(topReviewers);
      this.promptUser();
    });
  }

  private recommendMovies(): void {
    console.log("유저 ID와 추천받을 영화 개수를 입력하세요: \n");
    process.stdin.once("data", async (input) => {
      const [userId, count] = input.toString().trim().split(",");
      const recommendedMovies = await this.movieController.recommendMovies(
        parseInt(userId),
        parseInt(count)
      );
      console.log(recommendedMovies);
      this.promptUser();
    });
  }

  private getTopRatedMovies(): void {
    console.log("평점 순위권 영화 몇개를 보시겠습니까? \n");
    process.stdin.once("data", (input) => {
      const n = parseInt(input.toString().trim());
      console.log("최소 리뷰 수는 몇개인가요? \n");
      process.stdin.once("data", async (input) => {
        const minReviews = parseInt(input.toString().trim());
        const topRatedMovies = await this.movieController.getTopRatedMovies(
          n,
          minReviews
        );
        console.log(topRatedMovies);
        this.promptUser();
      });
    });
  }

  private updateReview(): void {
    console.log("수정할 리뷰 ID와 코멘트를 입력하세요: \n");
    process.stdin.once("data", async (input) => {
      const [reviewId, comment] = input.toString().trim().split(",");
      const response = await this.reviewController.updateReview(
        reviewId,
        comment
      );
      if (response.success) {
        console.log("리뷰가 수정되었습니다. \n");
      } else {
        console.log("리뷰 수정 실패:", response.error, "\n");
      }
      this.promptUser();
    });
  }

  private getMoviesByGenre(): void {
    console.log("장르를 입력하세요: \n");
    console.log(
      "장르는 Action, Comedy, Drama, Sci-Fi, Horror 중 하나여야 합니다. \n"
    );
    process.stdin.once("data", async (input) => {
      const genre = input.toString().trim() as Genre;
      const movies = await this.movieController.getMoviesByGenre(genre);
      console.log(movies);
      this.promptUser();
    });
  }
}
