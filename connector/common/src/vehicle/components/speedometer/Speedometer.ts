import { State } from "../../State.ts";

export class Speedometer {
  constructor(private readonly _state: State<number>) {}

  get state(): State<number> {
    return this._state;
  }
}

export default Speedometer;
