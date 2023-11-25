/**
 * JS의 문제점
 *
 * Dynamically typed language
 *
 * 1달, 1년 전 과거에 작성한 코드의 타입을 기억할 수 있나?
 * 내가 작성한거도 그렇겠지만, 남이 작성한 코드라면 기억하는 것은 불가능할 것이다.
 *
 * 문제해결방법. comment, jsdoc
 *
 * 그러나 함수를 변경하고 나서 doc도 같이 변경해주어야 한다.
 */

function add(var1, var2) {
  return var1 + var2;
}

console.log(add(1, 2));
console.log(add(1, "2"));
console.log(add("1", "2"));

// typeof로 runtime에 체크할 수 있다.

function addTypeSafe(num1, num2) {
  // 함수가 길어지고, runtime에서 밖에 체크할 수 없다.
  if (typeof num1 === "number" && typeof num2 === "number") {
    return num1 + num2;
  } else {
    throw new Error("숫자만 파라미터에 입력해주세요");
  }
}

console.log(addTypeSafe(1, 2));
console.log(addTypeSafe(1, "2"));
