import { Position } from "./Position.ts";
import { Network } from "./network/Network.ts";

export class IoT {
  private _network?: Network;
  private _position?: Position;

  constructor(network?: Network, position?: Position) {
    this._network = network;
    this._position = position;
  }

  get network(): Network | undefined {
    return this._network;
  }

  set network(network: Network | undefined) {
    this._network = network;
  }

  get position(): Position | undefined {
    return this._position;
  }

  set position(position: Position | undefined) {
    this._position = position;
  }
}
