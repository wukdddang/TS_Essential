import Player from "./Player";

export default class EvenBettingPlayer extends Player {
  constructor(name: string) {
    super(name);
  }

  update(diceNumber: number): void {
    this._winning = diceNumber % 2 === 0;
  }
}
