import CloneState from "../../../model/CloneState.ts";

import ConnectionModule from "./ConnectionModule.ts";
import CloneConnectionState from "./CloneConnectionState.ts";

export default class CloneConnectionModule {
  constructor(
    private readonly _cloneConnectionState: CloneConnectionState,
    private readonly _cloneState: CloneState<string>,
  ) {}

  public run(connectionModule: ConnectionModule): ConnectionModule {
    const clonedConnectionModule = connectionModule.state
      ? this._cloneConnectionState.run(connectionModule.state)
      : undefined;
    const clonedDetectedProtocolVersion =
      connectionModule.detectedProtocolVersion
        ? this._cloneState.run(connectionModule.detectedProtocolVersion)
        : undefined;
    const clonedSetProtocolVersion = connectionModule.setProtocolVersion
      ? this._cloneState.run(connectionModule.setProtocolVersion)
      : undefined;
    const clonedDetectedProtocol = connectionModule.detectedProtocol
      ? this._cloneState.run(connectionModule.detectedProtocol)
      : undefined;
    const clonedSetProtocol = connectionModule.setProtocol
      ? this._cloneState.run(connectionModule.setProtocol)
      : undefined;

    return new ConnectionModule(
      connectionModule.imei,
      clonedConnectionModule,
      clonedDetectedProtocolVersion,
      clonedSetProtocolVersion,
      clonedDetectedProtocol,
      clonedSetProtocol,
    );
  }
}
