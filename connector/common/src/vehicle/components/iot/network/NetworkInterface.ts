import { ConnectionModule } from "./ConnectionModule.ts";
import { Imei } from "./protocol/Imei.ts";

export interface NetworkInterface {
  get connectionModules(): ConnectionModule[];
  set connectionModules(connectionModules: ConnectionModule[]);
  getImeiOfFirstConnectedModule(): Imei | undefined;
  setConnectionModuleToDisconnected(imei: Imei): void;
  multipleModulesConnected(): boolean;
  getConnectedModule(): ConnectionModule | undefined;
  isConnected(): boolean;
  containsModules(): boolean;
}

export default NetworkInterface;
