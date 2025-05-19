import { TcpInterfaceMessage } from "../../../src/entities/tcpInterfaceMessage/TcpInterfaceMessage.ts";

export class CreateTcpInterfaceMessage {
  public run(options?: {
    data?: string;
  }) {
    const type = [
        TcpInterfaceMessage.onData,
        TcpInterfaceMessage.onConnection,
        TcpInterfaceMessage.onDisconnection,
      ][Math.floor(Math.random() * 3)];

    const socketId = crypto.randomUUID();

    return new TcpInterfaceMessage(
      type,
      socketId,
      options?.data ?? "test data",
      "track123"
    );
  }
}
