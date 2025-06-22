import ConnectionModule from "../../../../../components/iot/network/ConnectionModule.ts";
import UpdateState from "../UpdateState.ts";

import UpdateConnectionState from "./UpdateConnectionState.ts";

export default class UpdateConnectionModule {
  constructor(
    private _updateState: UpdateState,
    private _updateConnectionState: UpdateConnectionState,
  ) {}

  public run(
    toBeUpdated: ConnectionModule,
    updateBy: ConnectionModule,
  ): ConnectionModule {
    const state = this._updateConnectionState.run(
      toBeUpdated.state,
      updateBy.state,
    );

    const detectedProtocolVersion = this._updateState.run(
      toBeUpdated.detectedProtocolVersion,
      updateBy.detectedProtocolVersion,
    );

    const setProtocolVersion =
      toBeUpdated.setProtocolVersion === undefined
        ? updateBy.setProtocolVersion
        : toBeUpdated.setProtocolVersion;

    const detectedProtocol = this._updateState.run(
      toBeUpdated.detectedProtocol,
      updateBy.detectedProtocol,
    );

    const setProtocol =
      toBeUpdated.setProtocol === undefined
        ? updateBy.setProtocol
        : toBeUpdated.setProtocol;

    return new ConnectionModule(
      toBeUpdated.imei,
      state,
      detectedProtocolVersion,
      setProtocolVersion,
      detectedProtocol,
      setProtocol,
    );
  }
}
