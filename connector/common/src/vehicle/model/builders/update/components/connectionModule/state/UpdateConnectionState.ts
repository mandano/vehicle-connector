import ConnectionState from "../../../../../../components/iot/network/ConnectionState.ts";
import CloneConnectionState from "../../../../../../components/iot/network/CloneConnectionState.ts";
import UpdateStateNoUndefined from "../../state/noUndefined/UpdateStateNoUndefined.ts";
import PartialConnectionStateDto from "../../../../../../components/iot/network/connectionModule/connectionState/PartialConnectionStateDto.ts";

import UpdateConnectionStateResult from "./UpdateConnectionStateResult.ts";

export default class UpdateConnectionState {
  constructor(
    private readonly _updateState: UpdateStateNoUndefined,
    private readonly _cloneConnectionState: CloneConnectionState,
  ) {}

  public run(
    toBeUpdated: ConnectionState | undefined,
    updateBy: ConnectionState | undefined,
  ): UpdateConnectionStateResult {
    if (toBeUpdated === undefined && updateBy === undefined) {
      return new UpdateConnectionStateResult(
        undefined,
        undefined,
      );
    }

    if (toBeUpdated !== undefined && updateBy === undefined) {
      return new UpdateConnectionStateResult(
        this._cloneConnectionState.run(toBeUpdated),
        undefined,
      );
    }

    if (toBeUpdated === undefined && updateBy !== undefined) {
      return new UpdateConnectionStateResult(
        this._cloneConnectionState.run(updateBy),
        undefined,
      );
    }

    if (toBeUpdated !== undefined && updateBy !== undefined) {
      const state = this._updateState.run(toBeUpdated.state, updateBy.state);

      const connectionState = new ConnectionState(state.new);

      return new UpdateConnectionStateResult(
        connectionState,
        new PartialConnectionStateDto(state.changes),
      );
    }

    return new UpdateConnectionStateResult(
      undefined,
      undefined,
    );
  }
}
