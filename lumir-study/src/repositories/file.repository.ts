import fs from "fs/promises";
import path from "path";
import { Repository } from "../interfaces/repository.interface";

interface IdGenerator {
  getCurrentId(): number | string;
  getNextId(): number | string;
}

class NumericIdGenerator implements IdGenerator {
  private currentId: number;

  constructor(startId: number = 1) {
    this.currentId = startId;
  }

  getCurrentId(): number {
    return this.currentId;
  }

  getNextId(): number {
    return this.currentId++;
  }
}

class PrefixedIdGenerator implements IdGenerator {
  private currentId: number;
  private prefix: string;

  constructor(prefix: string, startId: number = 1) {
    this.prefix = prefix;
    this.currentId = startId;
  }

  getCurrentId(): string {
    return `${this.prefix}${this.currentId}`;
  }

  getNextId(): string {
    return `${this.prefix}${this.currentId++}`;
  }
}

export class FileRepository<T extends { id: string | number }>
  implements Repository<T>
{
  private data: T[] = [];
  private readonly filePath: string;
  private initialized: boolean = false;
  private idGenerator: IdGenerator;

  constructor(
    basePath: string,
    entityName: string,
    idType: "numeric" | "prefixed" = "numeric",
    prefix: string = ""
  ) {
    this.filePath = path.join(
      basePath,
      "data",
      `${entityName.toLowerCase()}.json`
    );
    // ID 생성기 초기화는 initialize()에서 수행
    this.idGenerator =
      idType === "numeric"
        ? new NumericIdGenerator()
        : new PrefixedIdGenerator(prefix);
  }

  async initialize(): Promise<void> {
    if (this.initialized) {
      return;
    }

    try {
      const dataDir = path.dirname(this.filePath);
      await fs.mkdir(dataDir, { recursive: true });

      const fileExists = await this.checkFileExists(this.filePath);

      if (fileExists) {
        const fileContent = await fs.readFile(this.filePath, "utf-8");
        try {
          const parsedData = JSON.parse(fileContent);
          if (Array.isArray(parsedData)) {
            this.data = parsedData;

            // 최대 ID 값 찾기
            if (this.data.length > 0) {
              const maxId = this.findMaxId(this.data);
              // ID 생성기 재초기화
              this.initializeIdGenerator(maxId);
            }

            console.log(
              `Loaded ${this.data.length} items from ${this.filePath}`
            );
          } else {
            throw new Error("Data file does not contain a valid array");
          }
        } catch (parseError) {
          throw new Error(`Failed to parse data file: ${parseError.message}`);
        }
      } else {
        this.data = [];
        await this.saveToFile();
        console.log(`Created new data file at ${this.filePath}`);
      }

      this.initialized = true;
    } catch (error) {
      console.error(`Repository initialization error:`, error);
      throw new Error(`Failed to initialize repository: ${error.message}`);
    }
  }

  private findMaxId(data: T[]): number {
    if (typeof data[0].id === "number") {
      return Math.max(...data.map((item) => Number(item.id)), 0);
    } else {
      // 문자열 ID의 경우 숫자 부분만 추출
      return Math.max(
        ...data.map((item) => {
          const numericPart = String(item.id).match(/\d+/);
          return numericPart ? parseInt(numericPart[0]) : 0;
        }),
        0
      );
    }
  }

  private initializeIdGenerator(maxId: number): void {
    this.idGenerator =
      typeof this.data[0]?.id === "number"
        ? new NumericIdGenerator(maxId + 1)
        : new PrefixedIdGenerator(
            String(this.data[0]?.id).replace(/\d+/g, ""),
            maxId + 1
          );
  }

  private async checkFileExists(filePath: string): Promise<boolean> {
    try {
      await fs.access(filePath);
      return true;
    } catch {
      return false;
    }
  }

  private saveToFile(): void {
    if (!this.initialized) {
      throw new Error("Repository not initialized");
    }

    try {
      console.log("Saving data to file:", this.filePath);
      console.log("Current data in memory:", this.data);

      // 동기식으로 파일 쓰기
      const fs = require("fs");
      fs.writeFileSync(
        this.filePath,
        JSON.stringify(this.data, null, 2),
        "utf8"
      );

      console.log("Data successfully written to file");
    } catch (error) {
      console.error("Error in saveToFile:", error);
      throw new Error(`Failed to save to file: ${error.message}`);
    }
  }

  async save(data: Omit<T, "id"> & { id?: T["id"] }): Promise<T> {
    await this.ensureInitialized();

    console.log("Saving new data:", data);

    let itemToSave: T;
    if (!data.id) {
      const newId = this.idGenerator.getNextId();
      itemToSave = { ...data, id: newId } as T;
      console.log("New item created with ID:", newId);
      this.data.push(itemToSave);
    } else {
      itemToSave = data as T;
      const index = this.data.findIndex((item) => item.id === data.id);
      if (index !== -1) {
        this.data[index] = itemToSave;
        console.log("Existing item updated:", itemToSave);
      } else {
        this.data.push(itemToSave);
        console.log("New item added with existing ID:", itemToSave);
      }
    }

    console.log("Current data before saving:", this.data);
    this.saveToFile(); // 동기식 호출
    console.log("Data saved successfully");
    return itemToSave;
  }

  private async ensureInitialized(): Promise<void> {
    if (!this.initialized) {
      await this.initialize();
    }
  }

  async findAll(): Promise<T[]> {
    await this.ensureInitialized();
    return [...this.data];
  }

  async findById(id: string | number): Promise<T | null> {
    await this.ensureInitialized();
    const item = this.data.find((item) => item.id === id);
    return item || null;
  }

  async update(id: string | number, data: Partial<T>): Promise<T | null> {
    await this.ensureInitialized();

    const index = this.data.findIndex((item) => item.id === id);
    if (index === -1) {
      return null;
    }

    const updatedItem = { ...this.data[index], ...data };
    this.data[index] = updatedItem;
    await this.saveToFile();
    return updatedItem;
  }

  async delete(id: string | number): Promise<void> {
    await this.ensureInitialized();

    const index = this.data.findIndex((item) => item.id === id);
    if (index !== -1) {
      this.data.splice(index, 1);
      await this.saveToFile();
    }
  }
}
