import { OrphanedSocketRepositoryInterface } from "../../../../../common/src/repositories/OrphanedSocketRepositoryInterface.ts";
import { Sockets } from "../../Sockets.ts";
import { WorkerQueue } from "../../../../../common/src/adapters/queue/rabbitMq/WorkerQueue.ts";
import { TcpInterfaceMessage } from "../../../../../common/src/entities/tcpInterfaceMessage/TcpInterfaceMessage.ts";
import { ImeiSocketIdFileRepository } from "../../../../../common/src/repositories/ImeiSocketIdFileRepository.ts";
import {
  TcpInterfaceMessageJsonConverterInterface
} from "../../../../../common/src/entities/tcpInterfaceMessage/TcpInterfaceMessageJsonConverterInterface.ts";

import { OnDisconnectionInterface } from "./OnDisconnectionInterface.ts";

export class OnDisconnection implements OnDisconnectionInterface {
  private orphanedSocketRepository: OrphanedSocketRepositoryInterface;
  private sockets: Sockets;
  private _fromTcpInterface: WorkerQueue;
  private _imeiSocketIdRepository: ImeiSocketIdFileRepository;
  private _tcpInterfaceMessageJsonConverter: TcpInterfaceMessageJsonConverterInterface;

  constructor(
    orphanedSocketRepository: OrphanedSocketRepositoryInterface,
    sockets: Sockets,
    fromTcpInterface: WorkerQueue,
    imeiSocketIdRepository: ImeiSocketIdFileRepository,
    tcpInterfaceMessageJsonConverter: TcpInterfaceMessageJsonConverterInterface,
  ) {
    this.orphanedSocketRepository = orphanedSocketRepository;
    this.sockets = sockets;
    this._fromTcpInterface = fromTcpInterface;
    this._imeiSocketIdRepository = imeiSocketIdRepository;
    this._tcpInterfaceMessageJsonConverter = tcpInterfaceMessageJsonConverter;
  }

  public async run(socketId: string): Promise<void> {
    const fromTcpInterfaceMessage = new TcpInterfaceMessage(
      TcpInterfaceMessage.onDisconnection,
      socketId,
      "",
    );

    await this._fromTcpInterface.send(this._tcpInterfaceMessageJsonConverter.toJson(fromTcpInterfaceMessage));
    this.orphanedSocketRepository.deleteBySocketCount(socketId);
    this.sockets.delete(socketId);
    this._imeiSocketIdRepository.deleteBySocketId(socketId);
  }
}
