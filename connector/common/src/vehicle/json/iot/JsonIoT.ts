import { JsonNetwork } from "./network/JsonNetwork.ts";
import { JsonPosition } from "./network/JsonPosition.ts";

export class JsonIoT {
  public network?: JsonNetwork;
  public position?: JsonPosition;

  constructor(network?: JsonNetwork, position?: JsonPosition) {
    this.network = network;
    this.position = position;
  }
}
