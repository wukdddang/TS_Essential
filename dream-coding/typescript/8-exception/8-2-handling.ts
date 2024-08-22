class TimeoutError extends Error {}
class OfflineError extends Error {}

class NetworkClient {
  tryConnect(): void {
    throw new OfflineError("no network!");
  }
}

class UserService {
  constructor(private client: NetworkClient) {}

  login() {
    this.client.tryConnect();
    // login...
  }
}

class App {
  constructor(private userService: UserService) {}
  run() {
    try {
      this.userService.login();
    } catch (error) {
      // show dialog to user -> network is offline!
      // TS에서는 error가 any 타입이기 때문에 instanceof를 쓸 수 없다.
    }
  }
}

const client = new NetworkClient();
const service = new UserService(client);
// service.login();

const app = new App(service);
app.run();
