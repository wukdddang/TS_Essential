/**
 * Type and Interface
 *
 * interface는 객체 형태로 선언해야 한다.
 * type은 값 형태로 사용할 수 있따.
 */

/**
 * Type
 *
 * 타입은 TS의 타입에 이름을 지어주는 역할이다.
 * 선언한 type의 이름으로 타입을 지정해줄 수 있따.
 */

type NewStringType = string;
type NewNullType = null;
type NewNumberType = number;
type MaleOrFemale = "male" | "female";

// moduleDetection: 'force'
// 파일별로 스코프를 다루기 위해 사용
const stringVar: NewStringType = "test";

type IdolType = {
  name: string;
  year: number;
};

const yuJin: IdolType = {
  name: "안유진",
  year: 2003,
};

/**
 * Interface
 *
 * interface는 type보다 나중에 생겨났다. type이 할 수 없는 기능을 구현하기 위해 생성된 것이다.
 * 겹치는 부분이 조금 있다.
 */

interface IdolInterface {
  name: string;
  year: number;
}

const yuJin2: IdolInterface = {
  name: "안유진",
  year: 2003,
};

interface IdolIT {
  name: NewStringType;
  year: NewNumberType;
}

const yuJin3: IdolIT = {
  name: "안유진",
  year: 2003,
};

interface IdolOptional {
  name: string;
  // 타입에서도 optional을 사용할 수 있따.
  year?: number;
}

const yuJin4: IdolOptional = {
  name: "안유진",
  year: 2003,
};
