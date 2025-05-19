import { SendToServer } from "../sendToConnector/SendToServer.ts";
import { LockState } from "../../../../connector/common/src/vehicle/components/lock/LockState.ts";
import { TransferLock } from "../../../../connector/common/src/vehicle/actions/TransferLock.ts";
import CreateMessageLineInterface from "../../../../modules/protocols/common/src/simulator/pakets/lock/CreateMessageLineInterface.ts";
import ContainsLockCheck from "../../../../connector/common/src/vehicle/components/lock/ContainsLockCheck.ts";
import ContainsIot from "../../../../connector/common/src/vehicle/components/iot/ContainsIot.ts";
import ContainsNetwork from "../../../../connector/common/src/vehicle/components/iot/network/ContainsNetwork.ts";
import Vehicle from "../../../../connector/common/src/vehicle/Vehicle.ts";

export class SendLock {
  constructor(
    private _sendToServer: SendToServer,
    private _lockToMessageLine: CreateMessageLineInterface,
  ) {}

  public async run(
    vehicle: Vehicle,
    trackingId: string,
  ): Promise<boolean | undefined> {
    if (
      !ContainsLockCheck.run(vehicle.model) ||
      vehicle.model.lock.state === undefined
    ) {
      return false;
    }

    if (ContainsIot.run(vehicle.model) === false) {
      return false;
    }

    if (
      ContainsNetwork.run(vehicle.model.ioT) === false ||
      vehicle.model.ioT.network === undefined
    ) {
      return false;
    }

    const imei =
      vehicle.model.ioT.network.getImeiOfFirstConnectionModule();

    if (imei === undefined) {
      return false;
    }

    const connectionModule =
      vehicle.model.ioT.network?.getConnectedModuleByImei(imei);

    if (connectionModule === undefined) {
      return false;
    }

    const protocolVersion = connectionModule.setProtocolVersion;
    const protocol = connectionModule.setProtocol;

    if (protocolVersion === undefined || protocol === undefined) {
      return false;
    }

    const messageLine = this._lockToMessageLine.run(
      new TransferLock(
        new LockState(vehicle.model.lock.state),
        trackingId,
        protocol.state,
        protocolVersion.state,
        imei,
      ),
    );

    if (messageLine === undefined) {
      return false;
    }

    return await this._sendToServer.run(messageLine);
  }
}
