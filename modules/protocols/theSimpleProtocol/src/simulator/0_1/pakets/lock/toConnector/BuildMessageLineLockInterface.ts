import { Imei } from "../../../../../../../../../connector/common/src/vehicle/components/iot/network/protocol/Imei.ts";
import { TransferLock } from "../../../../../../../../../connector/common/src/vehicle/actions/TransferLock.ts";

export interface BuildMessageLineLockInterface {
  run(lock: TransferLock, imei: Imei): string | undefined;
}
