import { MovieReviewService } from "./core/service/movie-review.service";
import { MovieDTO } from "./core/model/movie";
import { ReviewDTO } from "./core/model/review";

const movieService = new MovieReviewService();

function promptUser() {
  console.log(
    "명령어를 입력하세요 (영화추가, 리뷰추가, 영화조회, 좋아요누르기, 종료): "
  );
  process.stdin.once("data", (input) => {
    const command = input.toString().trim();
    switch (command) {
      case "영화추가":
        addMovie();
        break;
      case "리뷰추가":
        addReview();
        break;
      case "영화조회":
        getMovie();
        break;
      case "종료":
        process.exit(0);
      case "좋아요누르기":
        addLike();
        break;
      default:
        console.log("잘못된 명령어입니다.");
        promptUser();
    }
  });
}

function addMovie() {
  console.log("영화 정보를 입력하세요 (id,제목,감독,개봉년도,장르): ");
  process.stdin.once("data", (input) => {
    const [id, title, director, releaseYear, genre] = input
      .toString()
      .trim()
      .split(",");

    // 입력 데이터 유효성 검사
    if (!id || !title || !director || !releaseYear || !genre) {
      console.log("모든 필드를 입력해주세요.");
      promptUser();
      return;
    }

    const parsedId = parseInt(id);
    const parsedReleaseYear = parseInt(releaseYear);

    // id와 releaseYear가 유효한 숫자인지 확인
    if (isNaN(parsedId) || isNaN(parsedReleaseYear)) {
      console.log("ID와 개봉년도는 숫자여야 합니다.");
      promptUser();
      return;
    }

    const movieDTO: MovieDTO = {
      id: parsedId,
      title,
      director,
      releaseYear: parsedReleaseYear,
      genre,
    };

    try {
      movieService.addMovie(movieDTO);
      console.log("영화가 추가되었습니다.");
    } catch (error) {
      console.error("영화 추가 실패:", error.message);
    }

    promptUser();
  });
}

function addReview() {
  console.log("리뷰 정보를 입력하세요 (id,영화ID,사용자ID,평점,코멘트): ");
  process.stdin.once("data", (input) => {
    const [id, movieId, userId, rating, comment] = input
      .toString()
      .trim()
      .split(",");
    const reviewDTO: ReviewDTO = {
      id,
      movieId,
      userId,
      rating: parseInt(rating),
      comment,
      likes: 0,
    };
    try {
      movieService.addReview(reviewDTO);
      console.log("리뷰가 추가되었습니다.");
    } catch (error) {
      console.error("리뷰 추가 실패:", error.message);
    }
    promptUser();
  });
}

function getMovie() {
  console.log("조회할 영화 ID를 입력하세요: ");
  process.stdin.once("data", (movieIdInput) => {
    const movieId = parseInt(movieIdInput.toString().trim());
    console.log("1. 모든 리뷰 보기");
    console.log("2. 가장 인기 있는 리뷰 보기");
    console.log("3. 돌아가기");
    console.log("옵션을 선택하세요 (1 또는 2 또는 3): ");

    process.stdin.once("data", (optionInput) => {
      const option = parseInt(optionInput.toString().trim());
      const movie = movieService.getMovieWithReviews(movieId);

      if (movie) {
        if (option === 1) {
          console.log(movie);
        } else if (option === 2) {
          const topReview = movieService.getMostLikedReview(movieId);

          if (!topReview) {
            console.log("리뷰가 없습니다.");
          } else {
            console.log(
              `가장 인기 있는 리뷰: ${topReview?.comment} (좋아요: ${topReview?.likes})`
            );
          }
        } else if (option === 3) {
          promptUser();
        } else {
          console.log("잘못된 옵션을 선택하셨습니다.");
        }
      } else {
        console.log("해당 ID의 영화를 찾을 수 없습니다.");
      }

      promptUser();
    });
  });
}

function addLike() {
  console.log("좋아요를 누를 영화ID와 리뷰 ID를 입력하세요: ");
  process.stdin.once("data", (input) => {
    const [movieId, reviewId] = input.toString().trim().split(",");
    const movies = movieService.getMovieWithReviews(+movieId);
    const review = movies?.reviews.find((review) => review.id === reviewId);
    if (review) {
      review.likes++;
      console.log("좋아요가 눌렸습니다.");
    } else {
      console.log("리뷰를 찾을 수 없습니다.");
    }
    promptUser();
  });
}

promptUser();
