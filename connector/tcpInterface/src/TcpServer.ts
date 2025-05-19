import { Server, createServer } from "node:net";

import { LoggerInterface } from "../../common/src/logger/LoggerInterface.ts";

import { OnConnectionInterface } from "./socket/from/onEventsHandler/OnConnectionInterface.ts";
import { OnDisconnectionInterface } from "./socket/from/onEventsHandler/OnDisconnectionInterface.ts";
import { OnDataInterface } from "./socket/from/onEventsHandler/OnDataInterface.ts";
import { Sockets } from "./socket/Sockets.ts";
import { SocketInterface } from "./socket/SocketInterface.ts";
import { Socket } from "./socket/Socket.ts";

export class TcpServer {
  private server?: Server;
  private onConnection: OnConnectionInterface;
  private onDisconnection: OnDisconnectionInterface;
  private onData: OnDataInterface;
  private readonly port: number;
  private readonly hostname: string;
  private logger: LoggerInterface;

  private sockets: Sockets;

  private static readonly SERVER_EVENT_ON_ERROR = "error";

  constructor(
    port: number,
    hostname: string,
    onConnection: OnConnectionInterface,
    onDisconnection: OnDisconnectionInterface,
    onData: OnDataInterface,
    logger: LoggerInterface,
    sockets: Sockets,
  ) {
    this.onConnection = onConnection;
    this.onDisconnection = onDisconnection;
    this.onData = onData;
    this.port = port;
    this.hostname = hostname;
    this.logger = logger;

    this.sockets = sockets;
  }

  public async start(): Promise<boolean> {
    this.create();
    return await this.listen();
  }

  private create() {
    this.server = createServer((nodeSocket) => {
      const socket = new Socket(nodeSocket);

      this.onConnection.run(socket);
      this.addSocketEventListener(socket);
    });
  }

  private async listen(): Promise<boolean> {
    return await new Promise((resolve, reject) => {
      if (this.server === undefined) {
        reject(false);
        return;
      }

      this.server.listen(this.port, this.hostname, () => {
        this.logger.log(`Listening on port ${this.port}`);
        resolve(true);
      });

      this.addServerEventListener();
    });
  }

  private addServerEventListener(): void {
    if (this.server === undefined) {
      return;
    }

    this.server.on(TcpServer.SERVER_EVENT_ON_ERROR, (error) => {
      this.logger.error(error.message, TcpServer.name);
    });
  }

  private addSocketEventListener(socket: SocketInterface): void {
    socket.onEnd(() => {
      this.onSocketEnd(socket);
    });
    socket.onData((data: Buffer) => {
      this.onData.run(socket, data);
    });
    socket.onTimeout(() => {
      this.onSocketTimeout(socket);
    });
  }

  private onSocketEnd(socket: SocketInterface): void {
    const foundSocketKey = this.sockets.getSocketKeyByValue(socket);

    if (foundSocketKey === undefined) {
      return;
    }

    this.onDisconnection.run(foundSocketKey);
    this.sockets.delete(foundSocketKey);
  }

  private onSocketTimeout(socket: SocketInterface): void {
    const foundSocketKey = this.sockets.getSocketKeyByValue(socket);

    if (foundSocketKey === undefined) {
      return;
    }

    this.onDisconnection.run(foundSocketKey);
    this.sockets.delete(foundSocketKey);
  }
}
