import { State } from "../../State.ts";

export class Battery {
  private _voltage?: State<number>;
  private readonly _level: State<number>;

  constructor(level: State<number>, voltage?: State<number>) {
    this._voltage = voltage;
    this._level = level;
  }

  get voltage(): State<number> | undefined {
    return this._voltage;
  }

  set voltage(voltage: State<number>) {
    this._voltage = voltage;
  }

  get level(): State<number> {
    return this._level;
  }

  set level(level: State<number>) {
    this._level.state = level.state;
  }
}
