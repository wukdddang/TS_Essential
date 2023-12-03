/**
 * Generic in Type
 */

type GenericSimpleType<T> = T;

const genericString1: GenericSimpleType<string> = "코드팩토리";
// const genericString2: GenericSimpleType = '코드팩토리'

interface DoneState<T> {
  data: T[];
}

interface LoadingState {
  requestedAt: Date;
}

interface ErrorState {
  error: string;
}

type State<T = string> = DoneState<T> | LoadingState | ErrorState;

let state: State<string> = {
  data: ["123", "45"],
  requestedAt: new Date(),
  error: "에러",
};

// default type을 사용하면 이렇게 쓸 수 있지.
let state2: State = {
  data: ["굿", "잡"],
};
