import { FileRepository } from "../../repositories/file.repository";
import { MovieController } from "../controller/movie.controller";
import { ReviewController } from "../controller/review.controller";
import { MovieDTO } from "../dto/movie";
import { ReviewDTO } from "../dto/review";
import { MovieService } from "../service/movie.service";
import { ReviewService } from "../service/review.service";

export interface AppModuleConfig {
  basePath: string;
}

export class AppModule {
  private static instance: AppModule;

  public movieRepository: FileRepository<MovieDTO>;
  public reviewRepository: FileRepository<ReviewDTO>;
  public movieService: MovieService;
  public reviewService: ReviewService;
  public movieController: MovieController;
  public reviewController: ReviewController;

  private constructor(config: AppModuleConfig) {
    // Initialize repositories
    this.movieRepository = new FileRepository<MovieDTO>(
      config.basePath,
      "movie",
      "numeric"
    );
    this.reviewRepository = new FileRepository<ReviewDTO>(
      config.basePath,
      "review",
      "prefixed",
      "R"
    );

    // Initialize services
    this.movieService = MovieService.getInstance(this.movieRepository);
    this.reviewService = ReviewService.getInstance(this.reviewRepository);

    // Set up cross-references
    this.movieService.setReviewService(this.reviewService);
    this.reviewService.setMovieService(this.movieService);

    // Initialize controllers
    this.movieController = MovieController.getInstance(this.movieService);
    this.reviewController = ReviewController.getInstance(this.reviewService);
  }

  public static getInstance(config: AppModuleConfig): AppModule {
    if (!AppModule.instance) {
      AppModule.instance = new AppModule(config);
    }
    return AppModule.instance;
  }

  public async initialize(): Promise<void> {
    await this.movieRepository.initialize();
    await this.reviewRepository.initialize();
  }
}
