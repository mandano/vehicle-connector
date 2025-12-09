import Speedometer from "../../../../../components/speedometer/Speedometer.ts";
import UpdateStateNoUndefined from "../state/noUndefined/UpdateStateNoUndefined.ts";
import StateToChanges from "../state/StateToChanges.ts";
import CloneState from "../../../../CloneState.ts";

import UpdateSpeedometerInterface from "./UpdateSpeedometerInterface.ts";
import UpdateSpeedometerResult from "./UpdateSpeedometerResult.ts";

export default class UpdateSpeedometer implements UpdateSpeedometerInterface {
  constructor(
    private _updateState: UpdateStateNoUndefined,
    private _stateToChanges: StateToChanges,
    private _cloneState: CloneState<number>,
  ) {}

  public run(
    toBeUpdated: Speedometer | undefined,
    updateBy: Speedometer | undefined,
  ): UpdateSpeedometerResult {
    if (updateBy === undefined && toBeUpdated === undefined) {
      return new UpdateSpeedometerResult(undefined, undefined);
    }

    if (toBeUpdated === undefined) {
      const speedometer = new Speedometer(this._cloneState.run(updateBy!.state));
      const stateChanges = this._stateToChanges.run(updateBy!.state);

      return new UpdateSpeedometerResult(
        speedometer,
        stateChanges,
      );
    }

    if (updateBy === undefined) {
      return new UpdateSpeedometerResult(
        new Speedometer(this._cloneState.run(toBeUpdated!.state)),
        undefined,
      );
    }

    const updateStateResult = this._updateState.run(
      toBeUpdated!.state,
      updateBy!.state,
    );

    const speedometer = new Speedometer(updateStateResult.new);

    return new UpdateSpeedometerResult(speedometer, updateStateResult.changes);
  }
}
