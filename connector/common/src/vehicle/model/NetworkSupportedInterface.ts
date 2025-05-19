import { NetworkInterface } from "../components/iot/network/NetworkInterface.ts";

export interface NetworkSupportedInterface {
  get network(): NetworkInterface;
}
