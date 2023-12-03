export default abstract class Player {
  protected _winning: boolean = false;

  constructor(private _name: string) {}

  get name() {
    return this._name;
  }

  get winning() {
    return this._winning;
  }

  abstract update(diceNumber: number): void;
}
