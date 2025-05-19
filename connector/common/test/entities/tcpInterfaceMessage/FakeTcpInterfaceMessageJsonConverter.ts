import { TcpInterfaceMessageJsonConverterInterface } from "../../../src/entities/tcpInterfaceMessage/TcpInterfaceMessageJsonConverterInterface.ts";
import { TcpInterfaceMessage } from "../../../src/entities/tcpInterfaceMessage/TcpInterfaceMessage.ts";

export class FakeTcpInterfaceMessageJsonConverter
  implements TcpInterfaceMessageJsonConverterInterface
{
  private readonly _toJsonReturnValue: string;
  private readonly _fromJsonReturnValue: TcpInterfaceMessage | undefined;

  constructor(
    toJsonReturnValue: string,
    fromJsonReturnValue: TcpInterfaceMessage | undefined,
  ) {
    this._toJsonReturnValue = toJsonReturnValue;
    this._fromJsonReturnValue = fromJsonReturnValue;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  fromJson(json: string): TcpInterfaceMessage | undefined {
    return this._fromJsonReturnValue;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  toJson(fromTcpInterfaceMessage: TcpInterfaceMessage): string {
    return this._toJsonReturnValue;
  }
}
