import { State } from "../../State.ts";

export class Battery {
  constructor(
    private _level: State<number>,
    private _voltage?: State<number>,
  ) {}

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
    this._level.originatedAt = level.originatedAt;
    if (level.updatedAt !== undefined) {
      this._level.updatedAt = level.updatedAt;
    }
  }
}

export default Battery;
