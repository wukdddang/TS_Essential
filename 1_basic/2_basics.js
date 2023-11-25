"use strict";
/**
 * Types
 *
 *
 */
let helloText = "Hello";
// helloText = true; -> X
/**
 * JS에 존재하는
 * 7개의 타입
 */
const stringVar = "string";
const numberVar = 3;
const bigIntVar = BigInt(100000000);
const booleanVar = true;
const symbolVar = Symbol("good");
const nullVar = null;
const undefinedVar = undefined;
/**
 * TS에만 존재하는
 * 타입
 */
// any - 아무 타입이나 입력할 수 있는 치트키같은 타입
// 그러나 any를 많이 쓰면 타입스크립트를 사용하는 의미가 없다.
let anyVar;
anyVar = 10;
anyVar = "코드팩토리";
anyVar = true;
let testNumber = anyVar;
let testString = anyVar;
let testBoolean = anyVar;
// unknown - 알 수 없는 타입
let unknownType;
unknownType = 100;
unknownType = "코드팩토리";
unknownType = true;
let testNumber2 = unknownType; // X
let testString2 = unknownType; // X
let testBoolean2 = unknownType; // X
let unknownType2 = unknownType; // O
let anyType2 = unknownType; // O
// never - 어떠한 타입도 저장되거나 반환되지 않을 때 사용하는 타입
let neverType = null; // X
let neverType = undefined; // X
let neverType = "test"; // X
/**
 * 리스트(배열) 타입
 */
const koreanGirlGroup = ["아이브", "레드벨벳", "블랙핑크"];
const booleanList = [true, false, false, true];
