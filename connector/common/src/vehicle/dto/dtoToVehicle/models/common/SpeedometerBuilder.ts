import { Speedometer } from "../../../../components/speedometer/Speedometer.ts";
import SpeedometerDto from "../../../../components/speedometer/SpeedometerDto.ts";

import SetState from "./SetState.ts";

export default class SpeedometerBuilder {
  constructor(private readonly _setState: SetState) {}

  public build(speedometerDto: SpeedometerDto): Speedometer | undefined  {
    if (speedometerDto.state === undefined) {
      return undefined;
    }

    const state = this._setState.run<number>(speedometerDto.state)

    if (state === undefined) {
      return undefined;
    }

    return new Speedometer(state);
  }
}
