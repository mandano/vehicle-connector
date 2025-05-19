import { BuildMessageLineLockInterface } from "../../../../../simulator/0_1/pakets/lock/toConnector/BuildMessageLineLockInterface.ts";
import { THE_SIMPLE_PROTOCOL_ABBREVIATION } from "../../../../../Protocol.ts";
import { ID_0_1 } from "../../../../../versions.ts";
import { TransferLock } from "../../../../../../../../../connector/common/src/vehicle/actions/TransferLock.ts";

export class CreateMessageLine implements BuildMessageLineLockInterface {
  private static paketName = "LOCK";
  private static lockKey = "lock";
  private static lockOriginatedAtKey = "lockOriginatedAt";
  protected protocolVersion = ID_0_1;

  public run(lock: TransferLock): string | undefined {
    const header = [
      THE_SIMPLE_PROTOCOL_ABBREVIATION,
      this.protocolVersion,
      lock.imei,
      CreateMessageLine.paketName,
      new Date().toISOString(),
    ].join(";");
    const data = [
      `${CreateMessageLine.lockKey}=${lock.lock.state.state}`,
      `${CreateMessageLine.lockOriginatedAtKey}=${lock.lock.state.originatedAt?.toISOString()}`,
    ].join(",");
    return `${header};${data};${lock.trackingId}`;
  }
}

export default CreateMessageLine;
