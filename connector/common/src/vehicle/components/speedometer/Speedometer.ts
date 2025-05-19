import { State } from "../../State.ts";

export class Speedometer {
  private readonly _state: State<number>;

  //TODO: rename to structureAlike
  public static isSpeedometer(obj: unknown): obj is Speedometer {
    return (
      (obj as Speedometer).state !== undefined &&
      (obj as Speedometer).state !== null &&
      State.isState((obj as Speedometer).state)
    );
  }

  constructor(state: State<number>) {
    this._state = state;
  }

  get state(): State<number> {
    return this._state;
  }
}
