import { Application } from "./src/application";
import { AppModule } from "./src/core/module/app.module";

async function bootstrap() {
  try {
    const appModule = AppModule.getInstance({
      basePath: process.cwd(),
    });

    await appModule.initialize();

    const app = Application.getInstance({
      movieRepository: appModule.movieRepository,
      reviewRepository: appModule.reviewRepository,
      movieService: appModule.movieService,
      reviewService: appModule.reviewService,
      movieController: appModule.movieController,
      reviewController: appModule.reviewController,
    });

    await app.initialize();
  } catch (error) {
    console.error("애플리케이션 시작 중 오류 발생:", error);
    process.exit(1);
  }
}

bootstrap();
