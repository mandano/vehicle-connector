import { LoggerInterface } from "../../../../../common/src/logger/LoggerInterface.ts";
import { WorkerQueue } from "../../../../../common/src/adapters/queue/rabbitMq/WorkerQueue.ts";
import { TcpInterfaceMessage } from "../../../../../common/src/entities/tcpInterfaceMessage/TcpInterfaceMessage.ts";
import { Sockets } from "../../Sockets.ts";
import { TcpInterfaceMessageJsonConverterInterface } from "../../../../../common/src/entities/tcpInterfaceMessage/TcpInterfaceMessageJsonConverterInterface.ts";
import { SocketInterface } from "../../SocketInterface.ts";

import { OnDataInterface } from "./OnDataInterface.ts";

export class OnData implements OnDataInterface {
  private logger: LoggerInterface;
  private _fromTcpInterface: WorkerQueue;
  private _sockets: Sockets;
  private _tcpInterfaceMessageJsonConverter: TcpInterfaceMessageJsonConverterInterface;

  private static readonly LINE_FEED = 10;

  constructor(
    logger: LoggerInterface,
    sockets: Sockets,
    fromTcpInterface: WorkerQueue,
    tcpInterfaceMessageJsonConverter: TcpInterfaceMessageJsonConverterInterface,
  ) {
    this.logger = logger;
    this._sockets = sockets;
    this._fromTcpInterface = fromTcpInterface;
    this._tcpInterfaceMessageJsonConverter = tcpInterfaceMessageJsonConverter;
  }

  public async run(socket: SocketInterface, data: Buffer): Promise<void> {
    this.logger.info("new data received");

    if (data.length === 1 && data[0] === OnData.LINE_FEED) {
      this.logger.warn(`Line feed received.`, OnData.name);

      return;
    }

    const lastIndex = data.length - 1;

    if (data[lastIndex] === OnData.LINE_FEED) {
      data = data.subarray(0, -1);
    }

    const messageLineStr = data.toString();

    this.logger.debug(`Message: ${messageLineStr}`, OnData.name);

    const socketId = this._sockets.getSocketKeyByValue(socket);

    if (socketId === undefined) {
      this.logger.error(`Socket not found`, OnData.name);
      return;
    }

    const fromTcpInterfaceMessage = new TcpInterfaceMessage(
      "onData",
      socketId,
      messageLineStr,
    );

    const forwardedMessage = await this._fromTcpInterface.send(
      this._tcpInterfaceMessageJsonConverter.toJson(fromTcpInterfaceMessage),
    );

    if (forwardedMessage !== true) {
      this.logger.error(`Message not forwarded`, OnData.name);
      return;
    }
  }
}
