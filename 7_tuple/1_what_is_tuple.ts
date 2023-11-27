/**
 * Tuple
 */

let iveTopMembers: string[] = ["안유진", "장원영", "레이"];

let numberAndStringTuple: [number, string] = [23, "코드팩토리"];
// let numberAndStringTuple: [number, string] = ["코드팩토리", 23]; X

// 아래 코드는 에러가 발생하지 않는다!
numberAndStringTuple.push("아이유");
console.log(numberAndStringTuple);

// 튜플을 정확하게 사용하려면 readonly를 사용하자.
let unmodifiableTuple: readonly [number, string] = [23, "코드팩토리"];

// Property 'push' does not exist on type 'readonly [number, string]'.ts(2339)
// unmodifiableTuple.push('1')

/**
 * Tuple 유추하기
 */

let actressesTuple = ["김고은", "박소담", "전여빈"];

const actressesTupleConst = ["김고은", "박소담", "전여빈"] as const;

let stringArray: string[] = [...actressesTuple, ...actressesTupleConst];

/**
 * Named Tuple
 */

const namedTuple: [name: string, age: number] = ["코드팩토리", 32];

/**
 * Assigning Tuple to Tuple
 *
 * Tuple은 같은 타입끼리만 할당이 가능하다.
 */

const tuple1: [string, string] = ["아이유", "유애나"];
const tuple2: [number, number] = [1, 2];

// const tuple3: [boolean, boolean] = tuple1; // X
// const tuple4: [number, number, number] = tuple2 // X

let tuple5: [number, number] = tuple2;

/**
 * Tuple과 Array의 관계
 */

let ive: [string, string] = ["장원영", "안유진"];

let stringArr: string[] = ive; // O

// let ive2: [string, string] = stringArr // X

/**
 * Multi Dimensional Tuple
 */

const tuple2D: [string, number][] = [
  ["코드팩토리", 32],
  ["아이유", 31],
  ["김고은", 30],
];
