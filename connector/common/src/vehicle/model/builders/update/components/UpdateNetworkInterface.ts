import { Network } from "../../../../components/iot/network/Network.ts";

export interface UpdateNetworkInterface {
  run(toBeUpdated: Network, updateBy: Network): Network;
}
