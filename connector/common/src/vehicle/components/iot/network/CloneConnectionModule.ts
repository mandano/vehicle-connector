import CloneState from "../../../model/CloneState.ts";

import ConnectionModule from "./ConnectionModule.ts";
import CloneConnectionState from "./CloneConnectionState.ts";

export default class CloneConnectionModule {
  constructor(
    private readonly _cloneConnectionState: CloneConnectionState,
    private readonly _cloneState: CloneState<string>,
  ) {}

  public run(connectionModule: ConnectionModule): ConnectionModule {
    return new ConnectionModule(
      connectionModule.imei,
      this._cloneConnectionState.run(connectionModule.state),
      this._cloneState.run(connectionModule.detectedProtocolVersion),
      this._cloneState.run(connectionModule.setProtocolVersion),
      this._cloneState.run(connectionModule.detectedProtocol),
      this._cloneState.run(connectionModule.setProtocol),
    );
  }
}
