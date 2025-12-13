import CloneState from "../../../model/CloneState.ts";

import ConnectionState from "./ConnectionState.ts";

export default class CloneConnectionState {
  constructor(
    private readonly _cloneState: CloneState<
      typeof ConnectionState.CONNECTED | typeof ConnectionState.DISCONNECTED
    >,
  ) {}

  public run(
    connectionState: ConnectionState,
  ): ConnectionState {
    const state = this._cloneState.run(connectionState.state);

    return new ConnectionState(state);
  }
}
