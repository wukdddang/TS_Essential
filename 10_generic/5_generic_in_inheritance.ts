/**
 * Generic in Inheritance
 */

class BaseCache<T> {
  data: T[] = [];
}

class StringCache extends BaseCache<string> {}

const stringCache = new StringCache();
stringCache.data;

class GenericChild<T, Message> extends BaseCache<T> {
  message?: Message;

  constructor(message: Message) {
    super();
    this.message = message;
  }
}

const genericChild = new GenericChild<string, string>("error");
genericChild.data;
genericChild.message;

/**
 * 제너릭의 Inheritance
 */

interface BaseGeneric {
  name: string;
}

// T 타입은 무조건 BaseGeneric의 프로퍼티가 존재해야 한다.
class Idol<T extends BaseGeneric> {
  information: T;

  constructor(information: T) {
    this.information = information;
  }
}

// Idol 클래스가 받는 타입 T는 interface BaseGeneric을 상속받는다.
// name 프로퍼티가 없으면 에러가 발생한다.
const yuJin = new Idol({
  name: "안유진",
  age: 23,
});

/**
 * keyof 함께 사용하기
 */

const testObj = {
  a: 1,
  b: 2,
  c: 3,
};

function objectParser<O, K extends keyof O>(obj: O, key: K) {
  return obj[key];
}

const val = objectParser(testObj, "a");
const val2 = objectParser(testObj, "b");

/**
 * Type Ternary
 */

class Idol2 {
  type?: string;
}

class FemaleIdol extends Idol2 {
  type: "Female Idol" = "Female Idol";
}

class MaleIdol extends Idol2 {
  type: "Male Idol" = "Male Idol";
}

type SpecificIdol<T extends Idol2> = T extends MaleIdol ? MaleIdol : FemaleIdol;

const idol2: SpecificIdol<FemaleIdol> = new FemaleIdol();
const idol3: SpecificIdol<MaleIdol> = new MaleIdol();
