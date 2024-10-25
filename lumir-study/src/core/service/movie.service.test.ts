import { MovieService } from "./movie.service";
import { MovieDTO } from "../dto/movie";
import { Genre } from "../../types/genre";
import { Repository } from "../../interfaces/repository.interface";
import { ReviewService } from "./review.service";
import { ReviewDTO } from "../dto/review";

describe("MovieService", () => {
  let movieService: MovieService;
  let mockMovieRepository: jest.Mocked<Repository<MovieDTO>>;
  let mockReviewService: jest.Mocked<ReviewService>;

  const sampleMovie: MovieDTO = {
    id: 1,
    title: "Test Movie",
    director: "Test Director",
    genre: Genre.Action,
    releaseYear: 2024,
    duration: 120,
  };

  beforeEach(() => {
    // Repository 모킹
    mockMovieRepository = {
      initialize: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      save: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    // ReviewService 모킹
    mockReviewService = {
      getMovieStats: jest.fn(),
      getReviewsByUserId: jest.fn(),
    } as unknown as jest.Mocked<ReviewService>;

    // MovieService 인스턴스 생성
    movieService = MovieService.getInstance(mockMovieRepository);
    movieService.setReviewService(mockReviewService);
  });

  describe("initialize", () => {
    it("should initialize the repository", async () => {
      await movieService.initialize();
      expect(mockMovieRepository.initialize).toHaveBeenCalled();
    });
  });

  describe("addMovie", () => {
    const newMovie: Omit<MovieDTO, "id"> = {
      title: "New Movie",
      director: "New Director",
      genre: Genre.Action,
      releaseYear: 2024,
      duration: 120,
    };

    it("should add a new movie successfully", async () => {
      mockMovieRepository.findAll.mockResolvedValue([]);
      mockMovieRepository.save.mockResolvedValue({ id: 1, ...newMovie });

      const result = await movieService.addMovie(newMovie);
      expect(result).toEqual({ id: 1, ...newMovie });
    });

    it("should throw error when movie already exists", async () => {
      mockMovieRepository.findAll.mockResolvedValue([{ id: 1, ...newMovie }]);

      await expect(movieService.addMovie(newMovie)).rejects.toThrow(
        "Movie already exists"
      );
    });

    it("should throw error for invalid movie data", async () => {
      const invalidMovie = {
        ...newMovie,
        releaseYear: 1800, // 유효하지 않은 연도
      };

      mockMovieRepository.findAll.mockResolvedValue([]);

      await expect(movieService.addMovie(invalidMovie)).rejects.toThrow(
        "Invalid movie data"
      );
    });
  });

  describe("updateMovie", () => {
    const updates = { title: "Updated Title" };

    it("should update movie successfully", async () => {
      mockMovieRepository.findAll.mockResolvedValue([sampleMovie]);
      const updatedMovie = { ...sampleMovie, ...updates };
      mockMovieRepository.save.mockResolvedValue(updatedMovie);

      const result = await movieService.updateMovie(1, updates);
      expect(result).toEqual(updatedMovie);
    });

    it("should throw error when movie not found", async () => {
      mockMovieRepository.findAll.mockResolvedValue([]);

      await expect(movieService.updateMovie(1, updates)).rejects.toThrow(
        "Movie not found"
      );
    });
  });

  describe("getMovieById", () => {
    it("should return movie when found", async () => {
      mockMovieRepository.findById.mockResolvedValue(sampleMovie);

      const result = await movieService.getMovieById(1);
      expect(result).toEqual(sampleMovie);
    });

    it("should throw error when movie not found", async () => {
      mockMovieRepository.findById.mockResolvedValue(null);

      await expect(movieService.getMovieById(1)).rejects.toThrow(
        "Movie not found"
      );
    });
  });

  describe("getAllMovies", () => {
    it("should return all movies", async () => {
      const movies = [sampleMovie];
      mockMovieRepository.findAll.mockResolvedValue(movies);

      const result = await movieService.getAllMovies();
      expect(result).toEqual(movies);
    });
  });

  describe("getMoviesByGenre", () => {
    it("should return movies filtered by genre", async () => {
      const movies = [
        sampleMovie,
        { ...sampleMovie, id: 2, genre: Genre.Comedy },
      ];
      mockMovieRepository.findAll.mockResolvedValue(movies);

      const result = await movieService.getMoviesByGenre(Genre.Action);
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual(sampleMovie);
    });
  });

  describe("searchMovies", () => {
    it("should return movies matching search query", async () => {
      const movies = [sampleMovie];
      mockMovieRepository.findAll.mockResolvedValue(movies);

      const result = await movieService.searchMovies("Test");
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual(sampleMovie);
    });

    it("should return empty array when no matches found", async () => {
      mockMovieRepository.findAll.mockResolvedValue([sampleMovie]);

      const result = await movieService.searchMovies("NonExistent");
      expect(result).toHaveLength(0);
    });
  });

  describe("deleteMovie", () => {
    it("should delete movie successfully", async () => {
      mockMovieRepository.findAll.mockResolvedValue([sampleMovie]);

      await movieService.deleteMovie(1);
      expect(mockMovieRepository.delete).toHaveBeenCalledWith(1);
    });

    it("should throw error when movie not found", async () => {
      mockMovieRepository.findAll.mockResolvedValue([]);

      await expect(movieService.deleteMovie(1)).rejects.toThrow(
        "Movie not found"
      );
    });
  });

  describe("getTopRatedMovies", () => {
    it("should return top rated movies with minimum reviews", async () => {
      const movies = [sampleMovie, { ...sampleMovie, id: 2 }];

      mockMovieRepository.findAll.mockResolvedValue(movies);
      mockReviewService.getMovieStats.mockResolvedValueOnce({
        averageRating: 4.5,
        totalReviews: 10,
        positivePercentage: 90,
      });
      mockReviewService.getMovieStats.mockResolvedValueOnce({
        averageRating: 3.5,
        totalReviews: 5,
        positivePercentage: 70,
      });

      const result = await movieService.getTopRatedMovies(1, 3);
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe(1);
    });
  });

  describe("recommendMovies", () => {
    const userId = 1;
    const reviews = [
      { movieId: 1, rating: 4.5 },
      { movieId: 2, rating: 4.0 },
    ];

    it("should recommend movies based on user preferences", async () => {
      const movies = [
        sampleMovie,
        { ...sampleMovie, id: 2 },
        { ...sampleMovie, id: 3 },
      ];

      mockMovieRepository.findAll.mockResolvedValue(movies);
      mockReviewService.getReviewsByUserId.mockResolvedValue(
        reviews as ReviewDTO[]
      );
      mockReviewService.getMovieStats.mockResolvedValue({
        averageRating: 4.0,
        totalReviews: 10,
        positivePercentage: 80,
      });

      const result = await movieService.recommendMovies(userId, 2);
      expect(result).toHaveLength(1);
    });

    it("should return top rated movies when user has no reviews", async () => {
      mockReviewService.getReviewsByUserId.mockResolvedValue([]);
      mockMovieRepository.findAll.mockResolvedValue([sampleMovie]);
      mockReviewService.getMovieStats.mockResolvedValue({
        averageRating: 4.0,
        totalReviews: 5,
        positivePercentage: 80,
      });

      const result = await movieService.recommendMovies(userId, 1);
      expect(result).toHaveLength(1);
    });
  });

  describe("getMovieStats", () => {
    it("should return movie stats when movie exists", async () => {
      const stats = {
        totalReviews: 10,
        averageRating: 4.5,
        positivePercentage: 90,
      };

      mockMovieRepository.findById.mockResolvedValue(sampleMovie);
      mockReviewService.getMovieStats.mockResolvedValue(stats);

      const result = await movieService.getMovieStats(1);
      expect(result).toEqual(stats);
    });

    it("should return null when movie not found", async () => {
      mockMovieRepository.findById.mockResolvedValue(null);

      const result = await movieService.getMovieStats(1);
      expect(result).toBeNull();
    });
  });
});
