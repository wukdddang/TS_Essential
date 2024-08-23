type Video = {
  title: string;
  author: string;
  // description: string;
};

type Optional<T> = {
  [P in keyof T]?: T[P]; // for...in
};

type ReadOnly<T> = {
  readonly [P in keyof T]: T[P];
};

type VideoOptional = Optional<Video>;
const videoOp: VideoOptional = {};

type Animal = {
  name: string;
  age: number;
};

const animal: Optional<Animal> = {
  name: "hi",
};

animal.name = "woo";

const video: ReadOnly<Video> = {
  title: "extra",
  author: "woo",
};

// type VideoOptional = {
//   title?: string;
//   author?: string;
//   description?: string;
// };

// type VideoReadonly = {
//   title?: string;
//   author?: string;
//   description?: string;
// };

type Nullable<T> = {
  [P in keyof T]: T[P] | null;
};

const obj2: Nullable<Video> = {
  title: "helo",
  author: null,
};

type Proxy<T> = {
  get(): T;
  set(value: T): void;
};

type Proxify<T> = {
  [P in keyof T]: Proxy<T[P]>;
};
