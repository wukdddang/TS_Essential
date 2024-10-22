// core/database/db-manager.ts
import * as fs from "fs/promises";
import * as path from "path";

export class DatabaseManager {
  private readonly dbPath: string;
  private readonly movieDbPath: string;
  private readonly reviewDbPath: string;

  constructor(dbPath: string) {
    this.dbPath = dbPath;
    this.movieDbPath = path.join(dbPath, "Movie.json");
    this.reviewDbPath = path.join(dbPath, "Review.json");
  }

  async initialize(): Promise<void> {
    try {
      // Check if database directory exists, if not create it
      try {
        await fs.access(this.dbPath);
      } catch {
        await fs.mkdir(this.dbPath, { recursive: true });
      }

      // Create movie and review files if they don't exist
      for (const filePath of [this.movieDbPath, this.reviewDbPath]) {
        try {
          await fs.access(filePath);
        } catch {
          await fs.writeFile(filePath, JSON.stringify([], null, 2));
        }
      }
    } catch (error) {
      throw new Error(`Failed to initialize database: ${error.message}`);
    }
  }

  async readMovies<T>(): Promise<T[]> {
    try {
      const data = await fs.readFile(this.movieDbPath, "utf-8");
      return JSON.parse(data);
    } catch (error) {
      throw new Error(`Failed to read movies: ${error.message}`);
    }
  }

  async readReviews<T>(): Promise<T[]> {
    try {
      const data = await fs.readFile(this.reviewDbPath, "utf-8");
      return JSON.parse(data);
    } catch (error) {
      throw new Error(`Failed to read reviews: ${error.message}`);
    }
  }

  async writeMovies<T>(movies: T[]): Promise<void> {
    try {
      await fs.writeFile(this.movieDbPath, JSON.stringify(movies, null, 2));
    } catch (error) {
      throw new Error(`Failed to write movies: ${error.message}`);
    }
  }

  async writeReviews<T>(reviews: T[]): Promise<void> {
    try {
      await fs.writeFile(this.reviewDbPath, JSON.stringify(reviews, null, 2));
    } catch (error) {
      throw new Error(`Failed to write reviews: ${error.message}`);
    }
  }
}
