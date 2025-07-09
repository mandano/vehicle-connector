import OrphanedSocketRepositoryInterface from "../../../../../common/src/repositories/orphanedSocket/OrphanedSocketRepositoryInterface.ts";
import { Sockets } from "../../Sockets.ts";
import { WorkerQueue } from "../../../../../common/src/adapters/queue/rabbitMq/WorkerQueue.ts";
import { TcpInterfaceMessage } from "../../../../../common/src/entities/tcpInterfaceMessage/TcpInterfaceMessage.ts";
import { TcpInterfaceMessageJsonConverterInterface } from "../../../../../common/src/entities/tcpInterfaceMessage/TcpInterfaceMessageJsonConverterInterface.ts";

import { OnDisconnectionInterface } from "./OnDisconnectionInterface.ts";

export class OnDisconnection implements OnDisconnectionInterface {
  constructor(
    private readonly _orphanedSocketRepository: OrphanedSocketRepositoryInterface,
    private readonly _sockets: Sockets,
    private readonly _fromTcpInterface: WorkerQueue,
    private readonly _tcpInterfaceMessageJsonConverter: TcpInterfaceMessageJsonConverterInterface,
  ) {}

  public async run(socketId: string): Promise<void> {
    const fromTcpInterfaceMessage = new TcpInterfaceMessage(
      TcpInterfaceMessage.onDisconnection,
      socketId,
      "",
    );

    await this._fromTcpInterface.send(
      this._tcpInterfaceMessageJsonConverter.toJson(fromTcpInterfaceMessage),
    );

    await this._orphanedSocketRepository.deleteBySocketId(socketId);
    this._sockets.delete(socketId);
  }
}
