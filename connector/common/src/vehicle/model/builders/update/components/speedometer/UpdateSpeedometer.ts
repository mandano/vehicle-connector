import { UpdateState } from "../UpdateState.ts";
import { Speedometer } from "../../../../../components/speedometer/Speedometer.ts";

import { UpdateSpeedometerInterface } from "./UpdateSpeedometerInterface.ts";

export class UpdateSpeedometer implements UpdateSpeedometerInterface {
  private _updateState: UpdateState;

  constructor(updateState: UpdateState) {
    this._updateState = updateState;
  }

  public run(toBeUpdated: Speedometer, updateBy: Speedometer): Speedometer {
    this._updateState.run(toBeUpdated.state, updateBy.state);

    return toBeUpdated;
  }
}
