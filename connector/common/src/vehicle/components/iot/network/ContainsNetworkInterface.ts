import { Network } from "./Network.ts";

export interface ContainsNetworkInterface {
  get network(): Network | undefined;
}
