/**
 * Generic in Interface
 */

interface Cache<T> {
  data: T[];
  lastUpdate: Date;
}

const cache1: Cache<string> = {
  data: ["data1", "data2"],
  lastUpdate: new Date(),
};

// X
// const cache2: Cache = {
//   data: [123, 445],
//   lastUpdate: new Date(),
// }

// 타입을 입력하지 않을 때, 타입을 지정해줄 수 있다.
interface DefaultGeneric<T = string> {
  data: T[];
}

const cache3: DefaultGeneric = {
  data: ["123", "456"],
};

// X
// const cache4: DefaultGeneric = {
//   data: [123, 456]
// }
