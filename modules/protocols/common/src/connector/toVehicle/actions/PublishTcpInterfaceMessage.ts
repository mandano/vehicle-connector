import { TcpInterfaceMessage } from "../../../../../../../connector/common/src/entities/tcpInterfaceMessage/TcpInterfaceMessage.ts";
import { Exchange } from "../../../../../../../connector/common/src/adapters/queue/rabbitMq/Exchange.ts";
import { TcpInterfaceMessageJsonConverterInterface } from "../../../../../../../connector/common/src/entities/tcpInterfaceMessage/TcpInterfaceMessageJsonConverterInterface.ts";

export class PublishTcpInterfaceMessage {
  constructor(
    private _toTcpInterface: Exchange,
    private _tcpInterfaceMessageJsonConverter: TcpInterfaceMessageJsonConverterInterface,
  ) {}

  public async run(
    tcpInterfaceMessage: TcpInterfaceMessage,
  ): Promise<boolean> {
    await this._toTcpInterface.init();
    const published = await this._toTcpInterface.publish(
      this._tcpInterfaceMessageJsonConverter.toJson(tcpInterfaceMessage),
    );

    return published !== false;
  }
}

export default PublishTcpInterfaceMessage;

