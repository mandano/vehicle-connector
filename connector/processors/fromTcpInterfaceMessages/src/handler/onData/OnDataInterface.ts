import { TcpInterfaceMessage } from "../../../../../common/src/entities/tcpInterfaceMessage/TcpInterfaceMessage.ts";

export interface OnDataInterface {
  run(tcpInterfaceMessage: TcpInterfaceMessage): Promise<void>;
}
