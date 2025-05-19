import { ConnectionModule } from "../../../../components/iot/network/ConnectionModule.ts";

import { UpdateState } from "./UpdateState.ts";

export class UpdateConnectionModules {
  private _updateState: UpdateState;

  constructor(updateState: UpdateState) {
    this._updateState = updateState;
  }

  public run(
    toBeUpdated: ConnectionModule[],
    updateBy: ConnectionModule[],
  ): void {
    for (const connectionModule of updateBy) {
      const toBeUpdatedConnectionModuleIdx = toBeUpdated.findIndex(
        (toBeUpdatedConnectionModule) =>
          toBeUpdatedConnectionModule.imei === connectionModule.imei,
      );

      if (toBeUpdatedConnectionModuleIdx === -1) {
        toBeUpdated.push(connectionModule);
        continue;
      }

      toBeUpdated[toBeUpdatedConnectionModuleIdx].state = this._updateState.run(
        toBeUpdated[toBeUpdatedConnectionModuleIdx].state,
        connectionModule.state,
      );

      toBeUpdated[toBeUpdatedConnectionModuleIdx].detectedProtocolVersion =
        this._updateState.run(
          toBeUpdated[toBeUpdatedConnectionModuleIdx].detectedProtocolVersion,
          connectionModule.detectedProtocolVersion,
        );

      if (toBeUpdated[toBeUpdatedConnectionModuleIdx].setProtocolVersion === undefined) {
        toBeUpdated[toBeUpdatedConnectionModuleIdx].setProtocolVersion = connectionModule.setProtocolVersion;
      }

      toBeUpdated[toBeUpdatedConnectionModuleIdx].detectedProtocol =
        this._updateState.run(
          toBeUpdated[toBeUpdatedConnectionModuleIdx].detectedProtocol,
          connectionModule.detectedProtocol,
        );

      if (toBeUpdated[toBeUpdatedConnectionModuleIdx].setProtocol === undefined) {
        toBeUpdated[toBeUpdatedConnectionModuleIdx].setProtocol = connectionModule.setProtocol;
      }
    }
  }
}
