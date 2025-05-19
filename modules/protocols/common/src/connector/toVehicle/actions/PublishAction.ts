import { TcpInterfaceMessage } from "../../../../../../../connector/common/src/entities/tcpInterfaceMessage/TcpInterfaceMessage.ts";
import { ImeiSocketIdRepositoryInterface } from "../../../../../../../connector/common/src/repositories/ImeiSocketIdRepositoryInterface.ts";
import { TransferAction } from "../../../../../../../connector/common/src/vehicle/actions/TransferAction.ts";

import { PublishTcpInterfaceMessage } from "./PublishTcpInterfaceMessage.ts";

export class PublishAction {
  constructor(
    private _publishTcpInterfaceMessage: PublishTcpInterfaceMessage,
    private _imeiSocketIdRepository: ImeiSocketIdRepositoryInterface,
  ) {}

  public async run(
    action: TransferAction,
    messageLine: string,
  ): Promise<boolean> {
    const socketId = this._imeiSocketIdRepository.getSocketId(action.imei);

    if (socketId === undefined) {
      return false;
    }

    const tcpInterfaceMessage = new TcpInterfaceMessage(
      typeof action.action,
      socketId,
      messageLine,
      action.trackingId,
    );

    return await this._publishTcpInterfaceMessage.run(tcpInterfaceMessage);
  }
}

export default PublishAction;

