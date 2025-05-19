import { Socket as NodeSocket } from "node:net";

import { SocketInterface } from "./SocketInterface.ts";

export class Socket implements SocketInterface {
  public static readonly EVENT_ON_END = "end";
  public static readonly EVENT_ON_DATA = "data";
  public static readonly EVENT_ON_TIMEOUT = "timeout";

  private _socket: NodeSocket;

  constructor(socket: NodeSocket) {
    this._socket = socket;
  }

  public write(data: string): boolean {
    return this._socket.write(data);
  }

  public get remoteAddress(): string | undefined {
    return this._socket.remoteAddress;
  }

  public onEnd(onEnd: () => void): void {
    this._socket.on(Socket.EVENT_ON_END, onEnd);
  }

  public onTimeout(onTimeout: () => void): void {
    this._socket.on(Socket.EVENT_ON_TIMEOUT, onTimeout);
  }

  public onData(onData: (data: Buffer) => void): void {
    this._socket.on(Socket.EVENT_ON_DATA, onData);
  }
}
