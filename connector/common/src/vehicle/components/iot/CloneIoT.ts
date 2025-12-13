import IoT from "./IoT.ts";
import ClonePosition from "./position/ClonePosition.ts";
import CloneNetwork from "./network/CloneNetwork.ts";
import Network from "./network/Network.ts";
import Position from "./Position.ts";

export default class CloneIoT {
  constructor(
    private _clonePosition: ClonePosition,
    private _cloneNetwork: CloneNetwork,
  ) {}

  public run(ioT: IoT): IoT {
    let network: Network | undefined;
    let position: Position | undefined;

    if (ioT.network) {
      network = this._cloneNetwork.run(ioT.network);
    }

    if (ioT.position) {
      position = this._clonePosition.run(ioT.position);
    }

    return new IoT(
      network,
      position,
    );
  }
}
