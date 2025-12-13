import ConnectionModule from "../../../../../components/iot/network/ConnectionModule.ts";
import PartialConnectionModuleDto from "../../../../../components/iot/network/connectionModule/PartialConnectionModuleDto.ts";
import StateDtoChanges from "../../../../../components/state/StateDtoChanges.ts";
import PartialConnectionStateDto from "../../../../../components/iot/network/connectionModule/connectionState/PartialConnectionStateDto.ts";
import Imei from "../../../../../components/iot/network/protocol/Imei.ts";

import UpdateConnectionState from "./state/UpdateConnectionState.ts";
import UpdateConnectionModuleResult from "./UpdateConnectionModuleResult.ts";
import UpdateDetectedProtocol from "./detectedProtocol/UpdateDetectedProtocol.ts";
import UpdateDetectedProtocolVersion from "./detectedProtocol/UpdateDetectedProtocolVersion.ts";
import UpdateSetProtocolVersion from "./detectedProtocol/UpdateSetProtocolVersion.ts";
import UpdateSetProtocol from "./detectedProtocol/UpdateSetProtocol.ts";

export default class UpdateConnectionModule {
  constructor(
    private _updateConnectionState: UpdateConnectionState,
    private _updateDetectedProtocol: UpdateDetectedProtocol,
    private _updateDetectedProtocolVersion: UpdateDetectedProtocolVersion,
    private _updateSetProtocolVersion: UpdateSetProtocolVersion,
    private _updateSetProtocol: UpdateSetProtocol,
  ) {}

  public run(
    toBeUpdated: ConnectionModule,
    updateBy: ConnectionModule,
  ): UpdateConnectionModuleResult {
    const updateConnectionStateResult = this._updateConnectionState.run(
      toBeUpdated.state,
      updateBy.state,
    );
    const state = updateConnectionStateResult.new;

    const updateDetectedProtocolVersionResult =
      this._updateDetectedProtocolVersion.run(
        toBeUpdated.detectedProtocolVersion,
        updateBy.detectedProtocolVersion,
      );
    const detectedProtocolVersion = updateDetectedProtocolVersionResult.new;

    const updateDetectedProtocolResult = this._updateDetectedProtocol.run(
      toBeUpdated.detectedProtocol,
      updateBy.detectedProtocol,
    );
    const detectedProtocol = updateDetectedProtocolResult.new;

    const updateSetProtocolVersionResult = this._updateSetProtocolVersion.run(
      toBeUpdated.setProtocolVersion,
      updateBy.setProtocolVersion,
    );
    const setProtocolVersion = updateSetProtocolVersionResult.new;

    const updateSetProtocolResult = this._updateSetProtocol.run(
      toBeUpdated.setProtocol,
      updateBy.setProtocol,
    );
    const setProtocol = updateSetProtocolResult.new;

    const connectionModule = new ConnectionModule(
      toBeUpdated.imei,
      state,
      detectedProtocolVersion,
      setProtocolVersion,
      detectedProtocol,
      setProtocol,
    );

    // TODO: add test cases for changes variable
    const changes = this.setChanges(
      connectionModule.imei,
      updateConnectionStateResult.changes,
      updateDetectedProtocolVersionResult.changes,
      updateDetectedProtocolResult.changes,
      updateSetProtocolVersionResult.changes,
      updateSetProtocolResult.changes,
    );

    return new UpdateConnectionModuleResult(connectionModule, changes);
  }

  private setChanges(
    imei: Imei,
    changesConnectionState: PartialConnectionStateDto | undefined,
    changesDetectedProtocolVersion: StateDtoChanges<string> | undefined,
    changesDetectedProtocol: StateDtoChanges<string> | undefined,
    changesSetProtocolVersion: StateDtoChanges<string> | undefined,
    changesSetProtocol: StateDtoChanges<string> | undefined,
  ): PartialConnectionModuleDto | undefined {
    if (
      changesConnectionState === undefined &&
      changesDetectedProtocolVersion === undefined &&
      changesDetectedProtocol === undefined &&
      changesDetectedProtocolVersion === undefined &&
      changesSetProtocolVersion === undefined
    ) {
      return undefined;
    }

    const partialConnectionModuleDto = new PartialConnectionModuleDto(imei);

    if (changesConnectionState !== undefined) {
      partialConnectionModuleDto.state = changesConnectionState;
    }

    if (changesDetectedProtocolVersion !== undefined) {
      partialConnectionModuleDto.detectedProtocolVersion =
        changesDetectedProtocolVersion;
    }

    if (changesDetectedProtocol !== undefined) {
      partialConnectionModuleDto.detectedProtocol = changesDetectedProtocol;
    }

    if (changesSetProtocolVersion !== undefined) {
      partialConnectionModuleDto.setProtocolVersion = changesSetProtocolVersion;
    }

    if (changesSetProtocol !== undefined) {
      partialConnectionModuleDto.setProtocol = changesSetProtocol;
    }

    return partialConnectionModuleDto;
  }
}
