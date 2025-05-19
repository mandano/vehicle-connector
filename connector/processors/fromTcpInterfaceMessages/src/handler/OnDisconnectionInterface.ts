import { TcpInterfaceMessage } from "../../../../common/src/entities/tcpInterfaceMessage/TcpInterfaceMessage.ts";

export interface OnDisconnectionInterface {
  run(tcpInterfaceMessage: TcpInterfaceMessage): boolean | undefined;
}
