/**
 * Enum
 */

/**
 * EX)
 * API 요청을 한다.
 * 상태는 4가지 상태
 *
 * DONE - 요청 완료 상태
 * ERROR - 에러가 생긴 상태
 * LOADING - 로딩 상태
 * INITIAL - 초기 상태
 */

function runWork() {
  let state = "INITIAL";

  try {
    // 작업을 한다.
    state = "LOADING";
    state = "DONE";
  } catch (e) {
    state = "ERROR";
  } finally {
    return state;
  }
}

console.log(runWork() === "DONEE");

const doneState = "DONE";
const loadingState = "LOADING";
const errorState = "ERROR";
const initialState = "INITIAL";

function runWork2() {
  let state = initialState;

  try {
    // 작업을 한다.
    state = loadingState;
    state = doneState;
  } catch (e) {
    state = errorState;
  } finally {
    return state;
  }
}

// JS에서는, 오타에 의한 오류를 변수로 지정해줌으로써 해결할 수 있따.
console.log(runWork2() === doneState);

enum State {
  DONE = "DONE", // 아무 값도 설정하지 않으면 0으로 초기화 됨
  LOADING = "LOADING", // 아무 값도 설정하지 않으면 1으로 초기화 됨
  INITIAL = "INITIAL", // 아무 값도 설정하지 않으면 2으로 초기화 됨
  ERROR = "ERROR", // 아무 값도 설정하지 않으면 3으로 초기화 됨
}

function runWork3() {
  let state = State.INITIAL;

  try {
    // 작업을 한다.
    state = State.LOADING;
    state = State.DONE;
  } catch (e) {
    state = State.ERROR;
  } finally {
    return state;
  }
}

console.log(runWork3() === State.DONE);
console.log(runWork3());
