/**
 * Type Inference
 *
 * 타입 추론: 직접 타입을 추론하지 않아도 TS에서 타입을 정해주는 것
 */

let stringType = "string";
let booleanType = true;
let numberType = 30;

booleanType = false;

// booleanType = 'false' // X

const constStringType = "const string";
const constBooleanType = true;

let yuJin = {
  name: "안유진",
  age: 2003,
};

const yuJin2 = {
  name: "안유진",
  age: 2003,
};

const yuJin3 = {
  name: "안유진" as const,
  age: 2003 as const,
};

yuJin3.name = "안유진";

console.log(yuJin3.name);

/**
 * Array
 */

let numbers = [1, 2, 3, 4, 5];
let numbersAndString = [1, 2, 3, "4", "5", "6"];

// numbers.push(6);
// numbers.push('6');
const number = numbers[0];
const nos = numbersAndString[0];
const nos2 = numbersAndString[100];

// tuple
const twoNumbers = [1, 3] as const;

// twoNumbers[0] = 10;
// twoNumbers.push(100);
const first = twoNumbers[0];
