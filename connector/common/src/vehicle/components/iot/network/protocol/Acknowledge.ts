import { Exchange } from "../../../../../adapters/queue/rabbitMq/Exchange.ts";
import { TcpInterfaceMessageJsonConverterInterface } from "../../../../../entities/tcpInterfaceMessage/TcpInterfaceMessageJsonConverterInterface.ts";
import { LoggerInterface } from "../../../../../logger/LoggerInterface.ts";
import { TcpInterfaceMessage } from "../../../../../entities/tcpInterfaceMessage/TcpInterfaceMessage.ts";

import { MessageLineContext } from "./messageLineContext/MessageLineContext.ts";
import { AcknowledgeInterface } from "./AcknowledgeInterface.ts";

// TODO: implement correctly with theSimpleProtocol version 0_3
export class Acknowledge implements AcknowledgeInterface {
  private _toTcpInterface: Exchange;
  private _tcpInterfaceMessageJsonConverter: TcpInterfaceMessageJsonConverterInterface;
  private _logger: LoggerInterface;

  constructor(
    toTcpInterface: Exchange,
    tcpInterfaceMessageJsonConverter: TcpInterfaceMessageJsonConverterInterface,
    logger: LoggerInterface,
  ) {
    this._toTcpInterface = toTcpInterface;
    this._tcpInterfaceMessageJsonConverter = tcpInterfaceMessageJsonConverter;
    this._logger = logger;
  }

  public async run(
    socketId: string,
    messageLineContext: MessageLineContext,
  ): Promise<boolean | undefined> {
    if (
      messageLineContext.protocol === undefined ||
      messageLineContext.paket === undefined
    ) {
      this._logger.error(`Protocol or Paket not identified`, Acknowledge.name);

      return undefined;
    }

    // TODO: add createMessageLineContext dispatcher runner

    return undefined;


    /*
    const tcpInterfaceMessage = new TcpInterfaceMessage(
      TcpInterfaceMessage.acknowledge,
      socketId,
      messageLineResponseContext.paket.toMessageLine(),
      messageLineResponseContext.trackingId,
    );

    return await this._toTcpInterface.publish(
      this._tcpInterfaceMessageJsonConverter.toJson(tcpInterfaceMessage),
    );
    */
  }
}
