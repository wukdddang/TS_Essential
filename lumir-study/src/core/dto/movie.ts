import { Genre } from "../../types/genre";

export interface MovieDTO {
  id: number;
  title: string;
  director: string;
  releaseYear: number;
  genre: Genre;
  duration: number;
}
