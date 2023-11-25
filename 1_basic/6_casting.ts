/**
 * Casting
 *
 * TS에서 Casting을 하면 JS에서는 적용이 안된다.
 */
const codeFactory = "code factory";
const testNumber = 3;

console.log(codeFactory.toUpperCase());
// console.log(test.toUpperCase()); X

let sampleNumber: any = 5;

// sampleNumber는 number 타입임에도 toUpperCase()가 존재하는 것으로 유추함
// any는 무슨 타입이라도 될 수 있기 때문에 TS는 에러를 반환하지 않음

// console.log(sampleNumber.toUpperCase());
// 실제 해당 타입이 아니라도, 그 타입으로 강제하게할 수 있다.
// 막 사용하면 안된다.
let stringVar = sampleNumber as string; // stringVar는 string값이 된다.

// 자동완성에서는 string 타입으로 인식하고 string 내장 함수들을 추천해준다.
console.log(typeof (sampleNumber as string)); // number

let number = 5;

console.log((number as any).toUppercase()); // 이렇게 작성하면 에러가 발생하지 않는다.
