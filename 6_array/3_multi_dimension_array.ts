/**
 * Multi Dimension Array
 */
/**
 * 1D
 * [1, 2, 3]
 *
 * 2D
 * [
 *  [1, 2, 3],
 *  [1, 2, 3]
 * ]
 */

const number2DArr: number[][] = [
  [1, 2, 3],
  [4, 5, 6],
];

const str2DArr = [
  ["1", "2", "3"],
  ["4", "5", "6"],
];

const strAndNumberArr: (number | string)[][] = [
  [1, "2", 3],
  ["4", 5, "6"],
];

let strArrOrNumberArr: string[][] | number[][] = [
  [1, 2, 3],
  [4, 5, 6],
];

strArrOrNumberArr = [
  ["1", "2", "3"],
  ["4", "5", "6"],
];

for (let arr of number2DArr) {
  for (let item of arr) {
    console.log(item);
  }
}
