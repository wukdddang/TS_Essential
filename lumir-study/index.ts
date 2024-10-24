import { DatabaseManager, DBType } from "./src/db/db-manager";
import { MovieDTO } from "./src/core/dto/movie";
import { ReviewDTO } from "./src/core/dto/review";
import { Genre } from "./src/types/genre";
import { MovieReviewController } from "./src/core/controller/movie-review.controller";
import { MovieReviewService } from "./src/core/service/movie-review.service";
// import { Movie } from "./core/model/movie";
// import * as path from "path";

// MovieReviewController 인스턴스 생성

const movieReviewController = MovieReviewController.getInstance();
const dbManager = new DatabaseManager(
  process.cwd(),
  ["Movie", "Review"],
  DBType.FILE
);

async function initialize() {
  await movieReviewController.initialize();
  console.log("영화 리뷰 서비스가 초기화되었습니다.");
  promptUser();
}

function promptUser() {
  console.log(
    "명령어를 입력하세요 (1. 영화 추가, 2. 영화 상세수정, 3. 리뷰추가, 4. 영화 조회, 5. 좋아요 누르기, 6. 영화 검색, 7. 리뷰 수가 가장 많은 사용자 보기, 8. 영화 추천, 9. 평점 순위권 영화 보기, 10. 리뷰 수정하기, 11. 장르별 영화 보기, 12.종료): \n"
  );
  process.stdin.once("data", (input) => {
    const command = input.toString().trim();
    switch (command) {
      case "1":
        addMovie();
        break;
      case "2":
        updateMovie();
        break;
      case "3":
        addReview();
        break;
      case "4":
        getMovie();
        break;
      case "5":
        addLike();
        break;
      case "6":
        searchMovies();
        break;
      case "7":
        getUserTopReviewers();
        break;
      case "8":
        recommendMovies();
        break;
      case "9":
        getTopRatedMovies();
        break;
      case "10":
        updateReview();
        break;
      case "11":
        getMoviesByGenre();
        break;
      case "12":
        process.exit(0);
      default:
        console.log("잘못된 명령어입니다. \n");
        promptUser();
    }
  });
}

function addMovie() {
  console.log("영화 정보를 입력하세요 (제목,감독,개봉년도,장르,상영시간): \n");
  console.log(
    "장르는 Action, Comedy, Drama, Sci-Fi, Horror 중 하나여야 합니다. \n"
  );
  process.stdin.once("data", (input) => {
    try {
      const [title, director, releaseYear, genre, duration] = input
        .toString()
        .trim()
        .split(",");

      const parsedReleaseYear = parseInt(releaseYear);
      const parsedDuration = parseInt(duration);

      const movieDTO: Omit<MovieDTO, "id"> = {
        title,
        director,
        releaseYear: parsedReleaseYear,
        genre: genre as Genre,
        duration: parsedDuration,
      };

      movieReviewController.addMovie(movieDTO);
      console.log("영화가 추가되었습니다.");
    } catch (error) {
      console.error("영화 추가 실패:", error.message, "\n");
    } finally {
      promptUser();
    }
  });
}
function addReview() {
  console.log("리뷰 정보를 입력하세요 (영화ID,사용자ID,평점,코멘트): \n");
  process.stdin.once("data", async (input) => {
    try {
      const [movieId, userId, rating, comment] = input
        .toString()
        .trim()
        .split(",");

      const parsedMovieId = parseInt(movieId);
      const parsedUserId = parseInt(userId);
      const parsedRating = parseInt(rating);

      const reviewDTO: Omit<ReviewDTO, "id"> = {
        movieId: parsedMovieId,
        userId: parsedUserId,
        rating: parsedRating,
        comment,
        likes: 0,
        createdAt: new Date(),
      };

      const response = await movieReviewController.addReview(reviewDTO);

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
      promptUser(); // 한 번만 호출
    }
  });
}

function updateMovie() {
  console.log("수정할 영화 ID를 입력하세요: \n");
  process.stdin.once("data", (input) => {
    try {
      const movieId = parseInt(input.toString().trim());
      const movieWithReviews =
        movieReviewController.getMovieWithReviews(movieId);

      if (!movieWithReviews) {
        throw new Error("해당 ID의 영화를 찾을 수 없습니다. \n");
      }

      console.log(
        "수정할 영화 정보를 입력하세요 (제목,감독,개봉년도,장르,상영시간): \n"
      );

      process.stdin.once("data", (input) => {
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

        try {
          movieReviewController.updateMovie(movieId, movieDTO);
          console.log("영화 정보가 성공적으로 수정되었습니다. \n");
        } catch (error) {
          console.error("영화 정보 수정 실패:", error.message, "\n");
        }
        promptUser();
      });
    } catch (error) {
      console.error("영화 수정 실패:", error.message, "\n");
      promptUser();
    }
  });
}

function getMovie() {
  console.log("조회할 영화 ID를 입력하세요: \n");
  process.stdin.once("data", async (movieIdInput) => {
    try {
      const movieId = parseInt(movieIdInput.toString().trim());
      const movie = movieReviewController.getMovieWithReviews(movieId);

      console.log("1. 모든 리뷰 보기");
      console.log("2. 가장 인기 있는 리뷰 보기");

      console.log("3. 돌아가기");
      console.log("옵션을 선택하세요 (1 또는 2 또는 3): ");

      process.stdin.once("data", async (optionInput) => {
        const option = parseInt(optionInput.toString().trim());

        switch (option) {
          case 1:
            console.log(movie);
            break;
          case 2:
            const topReviewResponse =
              await movieReviewController.getMostLikedReview(movieId);
            if (topReviewResponse.success && topReviewResponse.data) {
              console.log(
                `가장 인기 있는 리뷰: ${topReviewResponse.data.comment} (좋아요: ${topReviewResponse.data.likes}) \n`
              );
            } else {
              console.log(topReviewResponse.error || "리뷰가 없습니다. \n");
            }
            break;
          case 3:
            break;
          default:
            console.log("잘못된 옵션을 선택하셨습니다. \n");
        }
        promptUser();
      });
    } catch (error) {
      console.error("영화 조회 실패:", error.message, "\n");
      promptUser();
    }
  });
}

// index.ts의 addLike 함수 수정
async function addLike() {
  console.log("좋아요를 누를 영화ID와 리뷰 ID를 입력하세요: \n");
  process.stdin.once("data", async (input) => {
    try {
      const [movieId, reviewId] = input.toString().trim().split(",");
      const parsedMovieId = parseInt(movieId);

      const response = await movieReviewController.addLike(
        parsedMovieId,
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
      promptUser();
    }
  });
}

function searchMovies() {
  console.log("검색할 영화 제목 또는 감독을 입력하세요: \n");
  process.stdin.once("data", async (input) => {
    const query = input.toString().trim();
    const results = await movieReviewController.searchMovies(query);
    console.log(results);
    promptUser();
  });
}

async function getUserTopReviewers() {
  console.log(
    "리뷰 수가 가장 많은 N명의 사용자를 보려면 숫자를 입력하세요: \n"
  );
  process.stdin.once("data", async (input) => {
    const n = parseInt(input.toString().trim());
    const topReviewers = await movieReviewController.getUserTopReviewers(n);
    if (topReviewers.data.length === 0) {
      console.log("리뷰가 없습니다. \n");
    } else {
      console.log(topReviewers);
    }
    promptUser();
  });
}

function recommendMovies() {
  console.log("유저 정보와 추천받을 영화 개수를 입력하세요: \n");
  process.stdin.once("data", (input) => {
    const [userId, count] = input.toString().trim().split(",");
    const parsedUserId = parseInt(userId);
    const parsedCount = parseInt(count);

    const recommendedMovies = movieReviewController.recommendMovies(
      parsedUserId,
      parsedCount
    );
    console.log(recommendedMovies);
    promptUser();
  });
}

function getTopRatedMovies() {
  console.log("평점 순위권 영화 몇개를 보시겠습니까? \n");
  process.stdin.once("data", (input) => {
    const n = parseInt(input.toString().trim());

    console.log("최소 리뷰 수는 몇개인가요? \n");
    process.stdin.once("data", (input) => {
      const minReviews = parseInt(input.toString().trim());
      const topRatedMovies = movieReviewController.getTopRatedMovies(
        n,
        minReviews
      );
      console.log(topRatedMovies);
      promptUser();
    });
  });
}

function updateReview() {
  console.log("수정할 리뷰 ID와 코멘트를 입력하세요: \n");
  process.stdin.once("data", (input) => {
    const [reviewId, comment] = input.toString().trim().split(",");
    movieReviewController.updateReview(reviewId, comment);
    console.log("리뷰가 수정되었습니다. \n");
    promptUser();
  });
}

function getMoviesByGenre() {
  console.log("장르를 입력하세요: \n");
  console.log(
    "장르는 Action, Comedy, Drama, Sci-Fi, Horror 중 하나여야 합니다. \n"
  );
  process.stdin.once("data", (input) => {
    const genre = input.toString().trim() as Genre;
    const movies = movieReviewController.getMoviesByGenre(genre);
    console.log(movies);
    promptUser();
  });
}

// 프로그램 시작
initialize().catch((error) => {
  console.error("서비스 초기화 중 오류 발생:", error);
  process.exit(1);
});
