import Odometer from "../../../../components/odometer/Odometer.ts";
import OdometerDto from "../../../../components/odometer/OdometerDto.ts";

import SetState from "./SetState.ts";

export default class OdometerBuilder {
  constructor(private readonly _setState: SetState) {}

  public build(odometer: OdometerDto): Odometer | undefined {
    const state = this._setState.run<number>(odometer.state);

    if (state === undefined) {
      return undefined;
    }

    return new Odometer(state);
  }
}
