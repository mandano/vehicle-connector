import IoT from "../../../../../components/iot/IoT.ts";
import CloneIoT from "../../../../../components/iot/CloneIoT.ts";
import UpdateNetworkInterface from "../network/UpdateNetworkInterface.ts";
import UpdatePositionInterface from "../position/UpdatePositionInterface.ts";

import UpdateIotResult from "./UpdateIotResult.ts";
import IotChanges from "./IotChanges.ts";
import IotToChanges from "./IotToChanges.ts";

export default class UpdateIoT {
  constructor(
    private _updateNetwork: UpdateNetworkInterface,
    private _updatePosition: UpdatePositionInterface,
    private _cloneIoT: CloneIoT,
    private _iotToChanges: IotToChanges,
  ) {}

  public run(
    toBeUpdated: IoT | undefined,
    updateBy: IoT | undefined,
  ): UpdateIotResult {
    if (toBeUpdated === undefined && updateBy === undefined) {
      return new UpdateIotResult(undefined);
    }

    if (updateBy === undefined) {
      return new UpdateIotResult(this._cloneIoT.run(toBeUpdated!), undefined);
    }

    if (toBeUpdated === undefined) {
      return new UpdateIotResult(
        this._cloneIoT.run(updateBy!),
        this._iotToChanges.run(updateBy!),
      );
    }

    const ioT = new IoT();

    const updatePositionResult = this._updatePosition.run(
      toBeUpdated.position,
      updateBy.position,
    );
    ioT.position = updatePositionResult.new;
    const positionChanges = updatePositionResult.changes;

    const updateNetworkResult = this._updateNetwork.run(
      toBeUpdated.network,
      updateBy.network,
    );
    ioT.network = updateNetworkResult.new;
    const networkChanges = updateNetworkResult.changes;

    if (positionChanges === undefined && networkChanges === undefined) {
      return new UpdateIotResult(ioT);
    }

    const changes = new IotChanges(positionChanges, networkChanges);

    return new UpdateIotResult(ioT, changes);
  }
}
