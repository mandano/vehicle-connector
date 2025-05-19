import { OnMessageInterfaceV2 } from "../../../../common/src/adapters/queue/OnMessageInterfaceV2.ts";
import { Sockets } from "../Sockets.ts";
import { TcpInterfaceMessageJsonConverterInterface } from "../../../../common/src/entities/tcpInterfaceMessage/TcpInterfaceMessageJsonConverterInterface.ts";
import { LoggerInterface } from "../../../../common/src/logger/LoggerInterface.ts";
import { HashColoredLoggerInterface } from "../../../../common/src/logger/HashColoredLoggerInterface.ts";

export class ProcessActionRequest implements OnMessageInterfaceV2 {
  private _logger: LoggerInterface;
  private _sockets: Sockets;
  private _tcpInterfaceMessageJsonConverter: TcpInterfaceMessageJsonConverterInterface;
  private _hashColoredLogger: HashColoredLoggerInterface;

  constructor(
      sockets: Sockets,
      tcpInterfaceMessageJsonConverter: TcpInterfaceMessageJsonConverterInterface,
      logger: LoggerInterface,
      hashColoredLogger: HashColoredLoggerInterface,
  ) {
    this._logger = logger;
    this._sockets = sockets;
    this._tcpInterfaceMessageJsonConverter = tcpInterfaceMessageJsonConverter;
    this._hashColoredLogger = hashColoredLogger;
  }

  public async run(
      toTcpInterfaceMessageAsString: string,
  ): Promise<boolean | undefined> {
    //TODO: handle incorrect payload

    const toTcpInterfaceMessage =
        this._tcpInterfaceMessageJsonConverter.fromJson(
            toTcpInterfaceMessageAsString,
        );

    if (toTcpInterfaceMessage === undefined) {
      this._logger.error(
          `No message to be sent, ${toTcpInterfaceMessageAsString}`,
          ProcessActionRequest.name,
      );

      return undefined;
    }

    const socket = this._sockets.get(toTcpInterfaceMessage.socketId);

    if (socket === undefined) {
      this._logger.error(
          `Socket not found, ${toTcpInterfaceMessage.socketId}`,
          ProcessActionRequest.name,
      );

      return undefined;
    }

    const sent = socket.write(toTcpInterfaceMessage.data);

    if (sent === false) {
      this._logger.error(
          `Message not sent, ${toTcpInterfaceMessageAsString}`,
          ProcessActionRequest.name,
      );

      return false;
    }

    if (toTcpInterfaceMessage.trackingId !== undefined) {
      this._hashColoredLogger.debug(
          `Message sent, ${toTcpInterfaceMessageAsString}`,
          toTcpInterfaceMessage.trackingId,
          ProcessActionRequest.name,
      );

      return sent;
    }

    this._logger.debug(
        `Message sent, ${toTcpInterfaceMessageAsString}`,
        ProcessActionRequest.name,
    );

    return sent;
  }
}