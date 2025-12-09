import Network from "../../../../../components/iot/network/Network.ts";

import UpdateNetworkResult from "./UpdateNetworkResult.ts";

export interface UpdateNetworkInterface {
  run(toBeUpdated: Network | undefined, updateBy: Network | undefined): UpdateNetworkResult;
}

export default UpdateNetworkInterface;
