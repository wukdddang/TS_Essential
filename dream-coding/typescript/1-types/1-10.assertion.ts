{
  /**
   * Type Assertions 💩
   */

  function jsStrFunc(): any {
    return "hello";
  }

  const result = jsStrFunc();
  result.length(
    // 문자열 내장 메서드를 사용하는 지 추론할 수 없음

    result as string
  ).length; // 이렇게 타입을 강제하면 문자열 내장 메서드를 사용할 수 있음

  const wrong: any = 5;
  console.log((wrong as Array<number>).push(1)); // 😱

  function findNumbers(): number[] | undefined {
    return undefined;
  }

  const numbers = findNumbers();
  numbers?.push(2); // 😱

  const button = document.querySelector("class")!;
}
