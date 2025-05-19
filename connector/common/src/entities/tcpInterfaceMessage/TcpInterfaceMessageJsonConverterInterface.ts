import { TcpInterfaceMessage } from "./TcpInterfaceMessage.ts";

export interface TcpInterfaceMessageJsonConverterInterface {
  toJson(fromTcpInterfaceMessage: TcpInterfaceMessage): string;
  fromJson(json: string): TcpInterfaceMessage | undefined;
}
