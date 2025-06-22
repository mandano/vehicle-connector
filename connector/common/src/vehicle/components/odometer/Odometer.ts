import { State } from "../../State.ts";

export class Odometer {
  public static isOdometer(obj: unknown): obj is Odometer {
    return (
      (obj as Odometer).state !== undefined &&
      (obj as Odometer).state !== null &&
      State.isState((obj as Odometer).state)
    );
  }

  constructor(private readonly _state: State<number>) {}

  get state(): State<number> {
    return this._state;
  }
}

export default Odometer;
