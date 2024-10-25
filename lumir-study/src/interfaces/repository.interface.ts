export interface Repository<T extends { id: string | number }> {
  save(data: Omit<T, "id"> & { id?: T["id"] }): Promise<T>;
  findAll(): Promise<T[]>;
  findById(id: T["id"]): Promise<T | null>;
  update(id: string | number, data: Partial<T>): Promise<T | null>;
  delete(id: string | number): Promise<void>;
  initialize(): Promise<void>;
}
