/**
 * Let's make a calculator 🧮
 */

type arithmeticOperations =
  | "add"
  | "substract"
  | "multiply"
  | "divide"
  | "remainder";

function calculate(
  operation: arithmeticOperations,
  number1: number,
  number2: number
): number {
  switch (operation) {
    case "add":
      return number1 + number2;
    case "substract":
      return number1 - number2;
    case "multiply":
      return number1 * number2;
    case "divide":
      return number1 / number2;
    case "remainder":
      return number1 % number2;
    default:
      throw Error("unknown operation");
  }
}

console.log(calculate("add", 1, 3)); // 4
console.log(calculate("substract", 3, 1)); // 2
console.log(calculate("multiply", 4, 2)); // 8
console.log(calculate("divide", 4, 2)); // 2
console.log(calculate("remainder", 5, 2)); // 1
