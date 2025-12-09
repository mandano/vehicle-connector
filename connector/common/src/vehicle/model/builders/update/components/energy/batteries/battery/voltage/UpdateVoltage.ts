import State from "../../../../../../../../State.ts";
import UpdateStateNoUndefined from "../../../../state/noUndefined/UpdateStateNoUndefined.ts";
import StateToChanges from "../../../../state/StateToChanges.ts";

import UpdateVoltageResult from "./UpdateVoltageResult.ts";

export default class UpdateVoltage {
  constructor(
    private _updateState: UpdateStateNoUndefined,
    private _stateToChanges: StateToChanges,
  ) {}

  public run(
    toBeUpdated: State<number> | undefined,
    updateBy: State<number> | undefined,
  ): UpdateVoltageResult {
    if (toBeUpdated === undefined && updateBy === undefined) {
      return new UpdateVoltageResult(undefined, undefined);
    }

    if (toBeUpdated !== undefined && updateBy === undefined) {
      return new UpdateVoltageResult(toBeUpdated, undefined);
    }

    if (toBeUpdated === undefined && updateBy !== undefined) {
      return new UpdateVoltageResult(updateBy, this._stateToChanges.run(updateBy));
    }

    const updateStateResult = this._updateState.run<number>(
      toBeUpdated!,
      updateBy!,
    );

    return new UpdateVoltageResult(
      updateStateResult.new,
      updateStateResult.changes,
    );
  }
}
