// db-manager.ts
import * as fs from "fs/promises";
import * as path from "path";

type DataType = "movies" | "reviews";

// ! 파일 읽기 쓰기는 동기로 해도 됨.

export enum DBType {
  FILE = "file",
  POSTGRES = "postgres",
  MONGODB = "mongodb",
}

export interface Repository {
  save(data: any): Promise<void>;
  findAll(): Promise<any[]>;
  findById(id: string): Promise<any | null>;
  update(id: string, data: any): Promise<any | null>;
  delete(id: string): Promise<void>;
}

export class DatabaseManager implements Repository {
  private readonly dbPath: string;
  private readonly movieDbPath: string;
  private readonly reviewDbPath: string;

  constructor(dbPath: string, entity: any[], type: DBType) {
    this.dbPath = dbPath;

    entity.forEach((e) => {
      this[`${e.name}DbPath`] = path.join(dbPath, `${e.name}.json`);
    });
  }
  save(data: any): Promise<void> {
    throw new Error("Method not implemented.");
  }
  findAll(): Promise<any[]> {
    throw new Error("Method not implemented.");
  }
  findById(id: string): Promise<any | null> {
    throw new Error("Method not implemented.");
  }
  update(id: string, data: any): Promise<any | null> {
    throw new Error("Method not implemented.");
  }
  delete(id: string): Promise<void> {
    throw new Error("Method not implemented.");
  }

  async initialize(): Promise<void> {
    try {
      await fs.mkdir(this.dbPath, { recursive: true });

      // Initialize movies.json if it doesn't exist
      try {
        await fs.access(this.movieDbPath);
      } catch {
        await fs.writeFile(this.movieDbPath, "[]");
      }

      // Initialize reviews.json if it doesn't exist
      try {
        await fs.access(this.reviewDbPath);
      } catch {
        await fs.writeFile(this.reviewDbPath, "[]");
      }
    } catch (error) {
      console.error("Error initializing database:", error);
      throw new Error("Failed to initialize database");
    }
  }

  async writeData<T>(data: T[], type: DataType): Promise<void> {
    try {
      const filePath = type === "movies" ? this.movieDbPath : this.reviewDbPath;
      await fs.writeFile(filePath, JSON.stringify(data, null, 2));
    } catch (error) {
      console.error(`Error writing ${type}:`, error);
      throw new Error(`Failed to write ${type} to database`);
    }
  }

  async readData<T>(type: DataType): Promise<T[]> {
    try {
      const filePath = type === "movies" ? this.movieDbPath : this.reviewDbPath;
      const data = await fs.readFile(filePath, "utf-8");
      return JSON.parse(data) as T[];
    } catch (error) {
      console.error(`Error reading ${type}:`, error);
      throw new Error(`Failed to read ${type} from database`);
    }
  }

  // 기존 메서드들을 새로운 메서드를 사용하도록 수정
  async writeMovies<T>(movies: T[]): Promise<void> {
    return await this.writeData(movies, "movies");
  }

  async writeReviews<T>(reviews: T[]): Promise<void> {
    return await this.writeData(reviews, "reviews");
  }

  async readMovies<T>(): Promise<T[]> {
    return await this.readData<T>("movies");
  }

  async readReviews<T>(): Promise<T[]> {
    return await this.readData<T>("reviews");
  }
}
