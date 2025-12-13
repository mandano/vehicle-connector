import type Imei from "../../../../../components/iot/network/protocol/Imei.ts";
import ConnectionModuleChanges from "../connectionModule/ConnectionModuleChanges.ts";

type ConnectionModulesChanges = Record<Imei, ConnectionModuleChanges>;

export default ConnectionModulesChanges;
