{
  /**
   * Primitive Type
   * number, string, boolean, bigint, symbol, null, undefined
   *
   * Object Type
   * function, array, ...
   */

  // number
  const num: number = 30;

  // string
  const str: string = "hello";

  // boolean
  const bool: boolean = true;

  // undefined
  let age: number | undefined;
  age = undefined;
  age = 1;

  function find(): number | undefined {
    return undefined;
  }

  // null
  let person: null;
  let person2: string | null;

  // unknown : 가능하면 사용하지 않는 것이 좋다.
  // JS와 호환성을 위해 사용
  let notSure: unknown = 0;
  notSure = "hello";
  notSure = true;

  // any: 가능하면 사용하지 않는 것이 좋다.
  // JS와 호환성을 위해 사용
  let anything: any = 0;
  anything = "hello";

  // void
  function print(): void {
    console.log("hello");
  }

  let unusable: void = undefined; // 거의 사용하지 않음

  // never
  function throwError(message: string): never {
    // message -> server (log)
    throw new Error(message);
    while (true) {}
  }

  let neverEnding: never; // 이렇게는 안쓰임

  // object : 가능하면 사용하지 않는 것이 좋다.
  // object는 원시타입을 제외한 모든 타입을 할당할 수 있다.
  // 좀 더 명확하게 타입을 명시하는 것이 좋다.
  let obj: object = [1, 2, 3];
  // let obj2: object = 1;
  function acceptSomeObject(obj: object) {}

  acceptSomeObject({ name: "wuk" });
  acceptSomeObject({ animal: "cat" });
}
