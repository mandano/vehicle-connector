import * as net from "net";

import { LoggerInterface } from "../../../../../connector/common/src/logger/LoggerInterface.ts";
import { LINE_FEED } from "../../../../../connector/common/src/vehicle/components/iot/network/protocol/messageLineContext/paket/messageLine/MessageLineCharacters.ts";
import { Socket } from "../../../../../connector/common/src/adapters/Socket.ts";

// TODO: refactor to share code parts with other classes, make more versatile in respect to setting responses
export class FakeTcpVehicle {
  private _connectingTimeout = 5000;
  private _connected: boolean = false;

  constructor(
    private readonly _socket: net.Socket,
    private readonly _logger: LoggerInterface,
    private readonly _host: string,
    private readonly _port: number,
    private readonly _responses: string[],
  ) {}

  public async connect(): Promise<boolean | undefined> {
    if (this._connected) {
      return false;
    }

    return new Promise<boolean>((resolve) => {
      const timeout = setTimeout(() => {
        this._logger.error("Connection timeout", FakeTcpVehicle.name);
        this._connected = false;
        resolve(false);
      }, this._connectingTimeout);

      this.addConnectionEventListenersBeforeConnect();

      this._socket.connect(this._port, this._host, () => {
        clearTimeout(timeout);
        this._logger.info("Connected to server", FakeTcpVehicle.name);
        this._connected = true;

        this.addConnectionEventListenersAfterConnect();
        resolve(true);
      });
    });
  }

  public sendMessage(message: string): boolean {
    return this._socket.write(message);
  }

  public disconnect(): void {
    this._socket.end(() => {
      this._logger.info("Disconnected from server", FakeTcpVehicle.name);
      this._connected = false;
    });
  }

  private addConnectionEventListenersAfterConnect(): void {
    this._socket.on(Socket.EVENT_ON_CLOSE, () => {
      this._logger.info("Connection closed");
      this._connected = false;
    });
    this._socket.on(Socket.EVENT_ON_DATA, (data: Buffer) => {
      this.onData(data);
    });
  }

  private addConnectionEventListenersBeforeConnect(): void {
    this._socket.on(Socket.EVENT_ON_ERROR, (err) => {
      this._logger.error(`Connection error ${err}`, FakeTcpVehicle.name);
      this._connected = false;
    });
    this._socket.on(Socket.EVENT_ON_TIMEOUT, () => {
      this._logger.error(`Connection timeout`, FakeTcpVehicle.name);
      this._connected = false;
    });
  }

  private onData(data: Buffer): boolean {
    this._logger.info("new data received");

    if (data.length === 1 && data[0] === LINE_FEED) {
      this._logger.warn(`Line feed received.`, FakeTcpVehicle.name);

      return false;
    }

    const lastIndex = data.length - 1;

    if (data[lastIndex] === LINE_FEED) {
      data = data.subarray(0, -1);
    }

    const requestMessageLine = data.toString();

    this._logger.info(requestMessageLine, FakeTcpVehicle.name);

    const responseMessageLine = this._responses.shift();

    if (responseMessageLine === undefined) {
      this._logger.error("No response available", FakeTcpVehicle.name);
      return false;
    }

    const responseMessageLineWithDateTime = responseMessageLine.replace(/\{(.*?)\}/g, (_, dateString) => {
      return new Date().toISOString();
    });

    return this.sendMessage(responseMessageLineWithDateTime);
  }
}
