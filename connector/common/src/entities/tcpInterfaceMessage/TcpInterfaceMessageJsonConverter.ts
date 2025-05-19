import { LoggerInterface } from "../../logger/LoggerInterface.ts";

import { TcpInterfaceMessage } from "./TcpInterfaceMessage.ts";
import { TcpInterfaceMessageJsonConverterInterface } from "./TcpInterfaceMessageJsonConverterInterface.ts";

export class TcpInterfaceMessageJsonConverter
  implements TcpInterfaceMessageJsonConverterInterface
{
  private _logger: LoggerInterface;

  constructor(logger: LoggerInterface) {
    this._logger = logger;
  }

  public toJson(tcpInterfaceMessage: TcpInterfaceMessage): string {
    return JSON.stringify({
      type: tcpInterfaceMessage.type,
      socketId: tcpInterfaceMessage.socketId,
      data: tcpInterfaceMessage.data,
      trackingId: tcpInterfaceMessage.trackingId,
    });
  }

  public fromJson(json: string): TcpInterfaceMessage | undefined {
    let obj: unknown;

    try {
      obj = JSON.parse(json);
    } catch (e) {
      this._logger.error(
        `Error parsing JSON: ${e}`,
        TcpInterfaceMessageJsonConverter.name,
      );

      return undefined;
    }

    if (!this.isValidTcpInterfaceMessage(obj)) {
      return undefined;
    }

    return new TcpInterfaceMessage(obj.type, obj.socketId, obj.data, obj.trackingId);
  }

  private isValidTcpInterfaceMessage(obj: unknown): obj is TcpInterfaceMessage {
    return (
      typeof obj === "object" &&
      obj !== null &&
      typeof (obj as TcpInterfaceMessage).type === "string" &&
      typeof (obj as TcpInterfaceMessage).socketId === "string" &&
      typeof (obj as TcpInterfaceMessage).data === "string"
    );
  }
}

export default TcpInterfaceMessageJsonConverter;

