{
  /**
   * Print Loading State
   */
  type LoadingState = {
    state: "loading";
  };

  type SuccessState = {
    state: "success";
    response: {
      body: string;
    };
  };

  type FailState = {
    state: "fail";
    reason: string;
  };

  type ResourceLoadState = LoadingState | SuccessState | FailState;

  function printLoginState(status: ResourceLoadState) {
    switch (status.state) {
      case "fail":
        console.log("😱 no network");
        break;
      case "loading":
        console.log("👀 loading...");
        break;
      case "success":
        console.log("😃 loaded");
        break;
      default:
        throw Error("Error Status");
    }
  }

  printLoginState({ state: "loading" }); // 👀 loading...
  printLoginState({ state: "success", response: { body: "loaded" } }); // 😃 loaded
  printLoginState({ state: "fail", reason: "no network" }); // 😱 no network
}
