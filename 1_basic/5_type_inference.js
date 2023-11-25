"use strict";
let stringType = "string";
let booleanType = true;
let numberType = 30;
booleanType = false;
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
    name: "안유진",
    age: 2003,
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
const twoNumbers = [1, 3];
// twoNumbers[0] = 10;
// twoNumbers.push(100);
const first = twoNumbers[0];
