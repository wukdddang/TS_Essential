{
  // function jsAdd(num1, num2) {
  //   return num1 + num2;
  // }

  // function add(num1: number, num2: number): number {
  //   return num1 + num2;
  // }

  // function jsFetchNum(id) {
  //   // code ...
  //   // code ...
  //   // code ...

  //   return new Promise((resolve, reject) => {
  //     resolve(100);
  //   });
  // }

  // function tsFetchNum(id: string): Promise<number> {
  //   // code ...
  //   // code ...
  //   // code ...

  //   return new Promise((resolve, reject) => {
  //     resolve(100);
  //   });
  // }

  // Optional Parameter
  function printName(firstName: string, lastName?: string) {
    console.log(firstName);
    console.log(lastName);
  }

  printName("woo", "changuk");
  printName("woo");

  // Default Parameter
  function printMessage(message: string = "default message") {
    console.log(message);
  }

  printMessage();

  // Rest Parameter
  function addNumbers(...numbers: number[]): number {
    return numbers.reduce((a, b) => a + b, 0);
  }

  console.log(addNumbers(1, 2, 30));
}
