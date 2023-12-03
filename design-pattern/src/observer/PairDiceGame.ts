import DiceGame from "./DiceGame";

export default class FairDiceGame extends DiceGame {
  play(): number {
    const diceNumber = Math.floor(Math.random() * 6) + 1;

    this.players.forEach((player) => {
      player.update(diceNumber);
    });
    return diceNumber;
  }
}
