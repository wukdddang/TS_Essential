/**
 * Union Basics
 *
 * 유니언은 TS에서 타입을 병합할 수 있는 수 많은 방법 중 하나이다.
 * TS에서 유니언은 합집합의 개념이다.
 */

type StringOrBooleanType = string | boolean;

let stringOrBooleanType: StringOrBooleanType = "아이브";
stringOrBooleanType = true;

// stringOrBooleanType = undefined; // X

type StrBoolNullType = string | boolean | null;

type StateTypes = "DONE" | "LOADING" | "ERROR";

let state: StateTypes = "DONE";
state = "LOADING";
// state = "INITIAL"; // X

/**
 * 리스트의 유니언
 */

type StringListOrBooleanList = string[] | boolean[];

let stringListOrBooleanList: StringListOrBooleanList = [
  "아이유",
  "김고은",
  "박소담",
];

stringListOrBooleanList = [true, false, false, true];

// stringListOrBooleanList = [true, "아이유"]; // X

type StringOrNumberList = (string | boolean)[];

let stringOrNumberList = [1, 2, 3, "아이유", "레드벨벳"];
stringOrNumberList = [1, 2, 3, 4];

// stringOrNumberList = [false, true] // X

/**
 * Interface로 사용하는 union
 */

interface Animal {
  name: string;
  age: number;
}

interface Human {
  name: string;
  age: number;
  address: string;
}

type AnimalOrHuman = Animal | Human;

let animalOrHuman: AnimalOrHuman = {
  name: "우창욱",
  age: 26,
  address: "대한민국",
};

// TS는 프로퍼티에 맞는 타입을 찾아낸다.
console.log(animalOrHuman); // Human 타입
console.log(animalOrHuman.name); // string
console.log(animalOrHuman.age); // number
console.log(animalOrHuman.address); // X

animalOrHuman = {
  name: "오리",
  age: 9,
};

console.log(animalOrHuman); // Animal 타입

console.log(animalOrHuman.name); // string
console.log(animalOrHuman.age); // number
// console.log(animalOrHuman.address); // X

// 이렇게 하면 에러는 안나는데, 이렇게 사용하지 말자.
console.log((animalOrHuman as Human).address); // undefined

let animalOrHuman2:
  | {
      name: string;
      age: number;
    }
  | {
      name: string;
      age: number;
      address: string;
    } = {
  name: "우창욱",
  age: 26,
  address: "대한민국",
};

console.log(animalOrHuman2.name);
console.log(animalOrHuman2.age);
console.log(animalOrHuman2.address);

animalOrHuman2 = {
  name: "오리",
  age: 9,
};

// interface(또는 type)를 사용하는 게 타입 에러를 읽기 더 쉽다.

console.log(animalOrHuman2.name);
console.log(animalOrHuman2.age);
// console.log(animalOrHuman2.address); // X

// 서로 관계가 없는 유니언을 선언하면 어떻게 되는가?

type Person = {
  name: string;
  age: number;
};

type Cat = {
  breed: string;
  country: string;
};

type PersonOrCat = Person | Cat;

const personOrCat1: PersonOrCat = {
  name: "우창욱",
  age: 26,
  breed: "Yorkshire Terrier",
  country: "영국",
};

// name, age만 있으면 Person
// breed, country만 있으면 Cat
// 타입 중 완전한 타입이 없으면 에러. 초과되는 건 OK
console.log(personOrCat1);
