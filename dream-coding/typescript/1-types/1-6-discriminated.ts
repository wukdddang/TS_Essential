{
  type SuccessState = {
    result: "success";
    response: { body: string };
  };

  type FailState = {
    result: "fail";
    reason: string;
  };

  type LoginState = SuccessState | FailState;

  function login1(id: string, password: string): LoginState {
    return {
      result: "success",
      response: {
        body: "logged in!",
      },
    };
  }

  // printLoginState(state)
  // success -> 🎉 body
  // fail -> 😭 reason

  function printLoginState1(state: LoginState) {
    if (state.result === "success") {
      console.log(`🎉 ${state.response.body}`);
    } else {
      console.log(`😭 ${state.reason}`);
    }
  }

  printLoginState1({ response: { body: "logged in!" } });
}
