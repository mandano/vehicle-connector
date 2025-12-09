import IoT from "../../../../../components/iot/IoT.ts";
import PositionToChanges from "../../../../../components/iot/position/PositionToChanges.js";
import NetworkToChanges from "../../../../../components/iot/network/NetworkToChanges.js";
import PositionChanges from "../position/PositionChanges.js";
import PartialNetworkDto from "../../../../../components/iot/network/PartialNetworkDto.js";

import IotChanges from "./IotChanges.ts";

export default class IotToChanges {
  public run(ioT: IoT): IotChanges {
    let position: PositionChanges | undefined;
    let network: PartialNetworkDto | undefined;

    if (ioT.position) {
      position = new PositionToChanges().run(ioT.position);
    }

    if (ioT.network) {
      network = new NetworkToChanges().run(ioT.network);
    }

    return new IotChanges(position, network);
  }
}
