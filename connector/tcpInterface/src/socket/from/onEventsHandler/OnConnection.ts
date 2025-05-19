import { randomUUID } from "node:crypto";

import { SocketInterface} from "../../SocketInterface.ts";
import { LoggerInterface } from "../../../../../common/src/logger/LoggerInterface.ts";
import { OrphanedSocketRepositoryInterface } from "../../../../../common/src/repositories/OrphanedSocketRepositoryInterface.ts";
import { TcpInterfaceMessage } from "../../../../../common/src/entities/tcpInterfaceMessage/TcpInterfaceMessage.ts";
import { WorkerQueue } from "../../../../../common/src/adapters/queue/rabbitMq/WorkerQueue.ts";
import { Sockets } from "../../Sockets.ts";
import {
  TcpInterfaceMessageJsonConverterInterface
} from "../../../../../common/src/entities/tcpInterfaceMessage/TcpInterfaceMessageJsonConverterInterface.ts";

import { OnConnectionInterface } from "./OnConnectionInterface.ts";

export class OnConnection implements OnConnectionInterface {
  private logger: LoggerInterface;
  private orphanedSocketRepository: OrphanedSocketRepositoryInterface;
  private _sockets: Sockets;
  private _fromTcpInterface: WorkerQueue;
  private _tcpInterfaceMessageJsonConverter: TcpInterfaceMessageJsonConverterInterface;

  constructor(
    logger: LoggerInterface,
    orphanedSocketRepository: OrphanedSocketRepositoryInterface,
    sockets: Sockets,
    fromTcpInterface: WorkerQueue,
    tcpInterfaceMessageJsonConverter: TcpInterfaceMessageJsonConverterInterface
  ) {
    this.logger = logger;
    this.orphanedSocketRepository = orphanedSocketRepository;
    this._sockets = sockets;
    this._fromTcpInterface = fromTcpInterface;
    this._tcpInterfaceMessageJsonConverter = tcpInterfaceMessageJsonConverter;
  }

  public async run(socket: SocketInterface): Promise<void> {
    this.logger.info("new connection received");

    const socketId = randomUUID();

    this._sockets.set(socketId, socket);

    const fromTcpInterfaceMessage = new TcpInterfaceMessage(
      TcpInterfaceMessage.onConnection,
      socketId,
      "",
    );

    const forwardedMessage = await this._fromTcpInterface.send(
      this._tcpInterfaceMessageJsonConverter.toJson(fromTcpInterfaceMessage),
    );

    if (forwardedMessage !== true) {
      this.logger.error(`Message not forwarded`, OnConnection.name);
      return;
    }

    this.orphanedSocketRepository.createBySocket(socket, socketId);
  }
}
