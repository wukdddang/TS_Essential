/**
 * Defining Function
 */

// function printName(name) {
//   console.log(name);
// }

function printName(name: string) {
  console.log(name);
}

function returnTwoCouples(person1: string, person2: string) {
  return `${person1}와 ${person2}는 사귀고 있습니다.`;
}

console.log(returnTwoCouples("아이유", "코드팩토리"));
// returnTwoCouples(0, 1); // X
// returnTwoCouples('아이유'); // X
// returnTwoCouples('아이유', '코드팩토리', '레드벨벳'); // X

/**
 * Optional Parameter
 */

function multiplyOrReturn(x: number, y?: number) {
  if (y) {
    return x * y;
  } else {
    return x;
  }
}

console.log(multiplyOrReturn(10, 20));
console.log(multiplyOrReturn(10));

function multiplyOrReturn2(x: number, y: number = 20) {
  return x * y;
}

console.log(multiplyOrReturn2(10));
console.log(multiplyOrReturn2(10, 30));

/**
 * rest parameter
 */

function getInfiniteParameters(...args: string[]) {
  return args.map((x) => `너무좋아 ${x}`);
}

console.log(getInfiniteParameters("아이유", "아이브", "블랙핑크"));
// console.log(getInfiniteParameters(1, 2, 3)); // X

/**
 * Return Type
 */

function addTwoNumbers(x: number, y: number) {
  return x + y;
}

addTwoNumbers(10, 20);

function randomNumber() {
  return Math.random() > 0.5 ? 10 : "랜덤";
}

randomNumber();

function subtractTwoNumbers(x: number, y: number): number {
  return x - y;
}

const subtractTwoNumbersArrow = (x: number, y: number): number => {
  return x - y;
};

/**
 * 특수 반환 타입
 *
 * void / never
 */

function doNotReturn(): void {
  console.log("저는 반환을 하지 않습니다.");

  // return 3; // X
  return; // O
}

doNotReturn();

// 타입 지정 안해주면 void 타입이 나온다.
function neverEndingLoop() {
  while (true) {
    // do something
    throw new Error("에러");
  }
}
// 타입 지정 안해주면 void 타입이 나온다.
function throwError2() {
  throw new Error("에러");
}

// 화살표 함수는 타입 지정 안해도 never 타입이 나온다.
const neverFunction = () => {
  throw new Error("에러");
};
