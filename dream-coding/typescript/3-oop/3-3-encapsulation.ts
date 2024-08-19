{
  type CoffeeCup = {
    shots: number;
    hasMilk: boolean;
  };

  // public, private, protected
  class CoffeeMaker {
    private static BEANS_GRAM_PER_SHOT: number = 7;
    private coffeeBeans: number = 0;

    constructor(coffeeBeans: number) {
      this.coffeeBeans = coffeeBeans;
    }

    static makeMachine(coffeeBeans: number): CoffeeMaker {
      return new CoffeeMaker(coffeeBeans);
    }

    fillCoffeeBeans(beans: number) {
      if (beans < 0) {
        throw new Error("커피콩의 크기는 0보다 커야 하겠습니다.");
      }

      this.coffeeBeans += beans;
    }

    makeCoffee(shots: number): CoffeeCup {
      if (this.coffeeBeans < shots * CoffeeMaker.BEANS_GRAM_PER_SHOT) {
        throw new Error("Not enough coffee beans!");
      }
      this.coffeeBeans -= shots * CoffeeMaker.BEANS_GRAM_PER_SHOT;

      return {
        shots,
        hasMilk: false,
      };
    }
  }

  const maker = new CoffeeMaker(32);
  maker.fillCoffeeBeans(20);

  class User {
    private internalAge = 4;

    get fullName(): string {
      return `${this.firstName} ${this.lastName}`;
    }

    get age(): number {
      return this.internalAge;
    }

    set age(num: number) {
      if (num < 0) {
        throw new Error("age must be larger than 0");
      }
      this.internalAge = num;
    }

    constructor(private firstName: string, private lastName: string) {}
  }

  const user = new User("changuk", "Woo");
  console.log(user.age);
  user.age = 26;
  console.log(user.age);
}
