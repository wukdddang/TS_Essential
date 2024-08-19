{
  type CoffeeCup = {
    shots: number;
    hasMilk: boolean;
  };

  class CoffeeMachine {
    coffeeBeans: number;
    private BEANS_GRAM_PER_SHOT: number;
    constructor(coffeeBeans: number, beansGramPerShot: number) {
      this.coffeeBeans = coffeeBeans;
      this.BEANS_GRAM_PER_SHOT = beansGramPerShot;
    }

    makeCoffee(shots: number): CoffeeCup {
      if (this.coffeeBeans < shots * this.BEANS_GRAM_PER_SHOT) {
        throw new Error("Not enough coffee beans!");
      }

      this.coffeeBeans -= shots * this.BEANS_GRAM_PER_SHOT;

      return {
        shots,
        hasMilk: false,
      };
    }
  }

  const coffeeMachine = new CoffeeMachine(20, 5);
  console.log(coffeeMachine.makeCoffee(3));
}
