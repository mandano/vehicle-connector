import { randomUUID } from "node:crypto";

import { SocketInterface } from "../../SocketInterface.ts";
import { LoggerInterface } from "../../../../../common/src/logger/LoggerInterface.ts";
import OrphanedSocketRepositoryInterface from "../../../../../common/src/repositories/orphanedSocket/OrphanedSocketRepositoryInterface.ts";
import { TcpInterfaceMessage } from "../../../../../common/src/entities/tcpInterfaceMessage/TcpInterfaceMessage.ts";
import { WorkerQueue } from "../../../../../common/src/adapters/queue/rabbitMq/WorkerQueue.ts";
import { Sockets } from "../../Sockets.ts";
import { TcpInterfaceMessageJsonConverterInterface } from "../../../../../common/src/entities/tcpInterfaceMessage/TcpInterfaceMessageJsonConverterInterface.ts";

import { OnConnectionInterface } from "./OnConnectionInterface.ts";

export class OnConnection implements OnConnectionInterface {
  constructor(
    private readonly _logger: LoggerInterface,
    private readonly _orphanedSocketRepository: OrphanedSocketRepositoryInterface,
    private readonly _sockets: Sockets,
    private readonly _fromTcpInterface: WorkerQueue,
    private readonly _tcpInterfaceMessageJsonConverter: TcpInterfaceMessageJsonConverterInterface,
    private readonly _appName: string
  ) {}

  public async run(socket: SocketInterface): Promise<void> {
    this._logger.info("new connection received");

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
      this._logger.error(`Message not forwarded`, OnConnection.name);
      return;
    }

    await this._orphanedSocketRepository.createBySocket(socket, socketId, this._appName);
  }
}
