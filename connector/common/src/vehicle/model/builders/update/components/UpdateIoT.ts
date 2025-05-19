import { IoT } from "../../../../components/iot/IoT.ts";

import { UpdateNetworkInterface } from "./UpdateNetworkInterface.ts";
import { UpdatePositionInterface } from "./UpdatePositionInterface.ts";

export class UpdateIoT {
  private _updateNetwork: UpdateNetworkInterface;
  private _updatePosition: UpdatePositionInterface;

  constructor(
    updateNetwork: UpdateNetworkInterface,
    updatePosition: UpdatePositionInterface,
  ) {
    this._updateNetwork = updateNetwork;
    this._updatePosition = updatePosition;
  }

  public run(toBeUpdated: IoT, updateBy: IoT): IoT {
    if (updateBy.position !== undefined) {
      if (toBeUpdated.position === undefined) {
        toBeUpdated.position = updateBy.position;
      } else {
        this._updatePosition.run(toBeUpdated.position, updateBy.position);
      }
    }

    if (updateBy.network !== undefined) {
      if (toBeUpdated.network === undefined) {
        toBeUpdated.network = updateBy.network;
      } else {
        this._updateNetwork.run(toBeUpdated.network, updateBy.network);
      }
    }

    return toBeUpdated;
  }
}
