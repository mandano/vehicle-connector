import { TcpInterfaceMessage } from "../../../common/src/entities/tcpInterfaceMessage/TcpInterfaceMessage.ts";
import { TcpInterfaceMessageJsonConverterInterface } from "../../../common/src/entities/tcpInterfaceMessage/TcpInterfaceMessageJsonConverterInterface.ts";
import { OnMessageInterface } from "../../../common/src/adapters/queue/OnMessageInterface.ts";

import { OnDataInterface } from "./handler/onData/OnDataInterface.ts";
import { OnDisconnectionInterface } from "./handler/OnDisconnectionInterface.ts";

export class ProcessFromTcpInterfaceMessage implements OnMessageInterface {
  private _onData: OnDataInterface;
  private _onDisconnection: OnDisconnectionInterface;
  private _tcpInterfaceMessageJsonConverter: TcpInterfaceMessageJsonConverterInterface;

  constructor(
    onData: OnDataInterface,
    onDisconnection: OnDisconnectionInterface,
    tcpInterfaceMessageJsonConverter: TcpInterfaceMessageJsonConverterInterface,
  ) {
    this._onData = onData;
    this._onDisconnection = onDisconnection;
    this._tcpInterfaceMessageJsonConverter = tcpInterfaceMessageJsonConverter;
  }

  public async run(message: string): Promise<void> {
    const fromTcpInterfaceMessage =
      this._tcpInterfaceMessageJsonConverter.fromJson(message);

    if (fromTcpInterfaceMessage === undefined) {
      return undefined;
    }

    if (fromTcpInterfaceMessage.type === TcpInterfaceMessage.onData) {
      await this._onData.run(fromTcpInterfaceMessage);
    } else if (
      fromTcpInterfaceMessage.type === TcpInterfaceMessage.onDisconnection
    ) {
      this._onDisconnection.run(fromTcpInterfaceMessage);
    }
    return undefined;
  }
}
