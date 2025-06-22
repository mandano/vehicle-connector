import ConnectionState from "../../../../../components/iot/network/ConnectionState.ts";
import UpdateState from "../UpdateState.ts";
import CloneConnectionState from "../../../../../components/iot/network/CloneConnectionState.ts";

export default class UpdateConnectionState {
  constructor(
    private readonly _updateState: UpdateState,
    private readonly _cloneConnectionState: CloneConnectionState,
  ) {}

  public run(
    toBeUpdated: ConnectionState | undefined,
    updateBy: ConnectionState | undefined,
  ): ConnectionState | undefined {
    if (updateBy === undefined) {
      return this._cloneConnectionState.run(toBeUpdated);
    }

    if (toBeUpdated === undefined) {
      return this._cloneConnectionState.run(updateBy);
    }

    if (updateBy.state !== undefined) {
      const state = this._updateState.run(toBeUpdated.state, updateBy.state);
      if (state === undefined) {
        return this._cloneConnectionState.run(toBeUpdated);
      }

      return new ConnectionState(state);
    }

    return this._cloneConnectionState.run(toBeUpdated);
  }
}

