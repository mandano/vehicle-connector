import State from "../../../../../../State.js";
import UpdateStateNoUndefined from "../../state/noUndefined/UpdateStateNoUndefined.ts";
import UpdateStateResult from "../../state/UpdateStateResult.ts";

export default class UpdateDetectedProtocolVersion {
  constructor(private _updateState: UpdateStateNoUndefined) {}

  public run(
    toBeUpdated: State<string> | undefined,
    updateBy: State<string> | undefined,
  ): UpdateStateResult<string> {
    if (toBeUpdated === undefined && updateBy === undefined) {
      return new UpdateStateResult<string>(undefined, undefined);
    }

    if (toBeUpdated === undefined && updateBy !== undefined) {
      return new UpdateStateResult<string>(
        new State(
          updateBy.state,
          updateBy.originatedAt,
          updateBy.updatedAt,
          updateBy.createdAt,
        ),
        undefined,
      );
    }

    if (toBeUpdated !== undefined && updateBy === undefined) {
      return new UpdateStateResult<string>(
        new State(
          toBeUpdated.state,
          toBeUpdated.originatedAt,
          toBeUpdated.updatedAt,
          toBeUpdated.createdAt,
        ),
        undefined,
      );
    }

    const updateStateResult = this._updateState.run(toBeUpdated!, updateBy!);

    return new UpdateStateResult<string>(
      updateStateResult.new,
      updateStateResult.changes,
    );
  }
}
