import StateToChanges from "../state/StateToChanges.ts";
import State from "../../../../../State.ts";
import CloneStateExt from "../../../../CloneStateExt.ts";

import UpdateStateNoUndefined from "./noUndefined/UpdateStateNoUndefined.ts";
import UpdateStateResult from "./UpdateStateResult.ts";

export default class UpdateState {
  constructor(
    private _updateState: UpdateStateNoUndefined,
    private _stateToChanges: StateToChanges,
    private _cloneState: CloneStateExt,
  ) {}

  public run<T>(
    toBeUpdated: State<T> | undefined,
    updateBy: State<T> | undefined,
  ): UpdateStateResult<T> {
    if (updateBy === undefined && toBeUpdated === undefined) {
      return new UpdateStateResult<T>(undefined, undefined);
    }

    if (toBeUpdated === undefined) {
      const stateChanges = this._stateToChanges.run<T>(updateBy!);

      return new UpdateStateResult<T>(
        this._cloneState.run<T>(updateBy!),
        stateChanges,
      );
    }

    if (updateBy === undefined) {
      return new UpdateStateResult<T>(
        this._cloneState.run<T>(toBeUpdated!),
        undefined,
      );
    }

    const updateStateResult = this._updateState.run<T>(toBeUpdated!, updateBy!);

    return new UpdateStateResult<T>(
      updateStateResult.new,
      updateStateResult.changes,
    );
  }
}
