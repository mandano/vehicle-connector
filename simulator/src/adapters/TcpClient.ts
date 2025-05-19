import * as net from "net";

import { Vehicle } from "../../../connector/common/src/vehicle/Vehicle.ts";
import { LoggerInterface } from "../../../connector/common/src/logger/LoggerInterface.ts";
import { LINE_FEED } from "../../../connector/common/src/vehicle/components/iot/network/protocol/messageLineContext/paket/messageLine/MessageLineCharacters.ts";
import { Socket } from "../../../connector/common/src/adapters/Socket.ts";

import { OnDataInterface } from "./tcpClient/onData/OnDataInterface.ts";

export class TcpClient {
  private _connectingTimeout = 5000;
  private client: net.Socket;
  private host: string;
  private readonly port: number;
  private _connected: boolean = false;
  private _onData: OnDataInterface;
  private readonly _vehicle: Vehicle;
  private _logger: LoggerInterface;

  constructor(
    host: string,
    port: number,
    vehicle: Vehicle,
    onData: OnDataInterface,
    logger: LoggerInterface,
  ) {
    this.client = new net.Socket();
    this.host = host;
    this.port = port;
    this._vehicle = vehicle;
    this._onData = onData;
    this._logger = logger;
  }

  public async connect(): Promise<boolean | undefined> {
    if (this._connected) {
      return undefined;
    }

    return new Promise<boolean>((resolve) => {
       const timeout = setTimeout(() => {
        this._logger.error("Connection timeout", TcpClient.name);
        this._connected = false;
        resolve(false);
      }, this._connectingTimeout);

      this.addConnectionEventListenersBeforeConnect();

      this.client.connect(this.port, this.host, () => {
        clearTimeout(timeout);
        this._logger.info("Connected to server", TcpClient.name);
        this._connected = true;

        this.addConnectionEventListenersAfterConnect();
        resolve(true);
      });
    });
  }

  public sendMessage(message: string): boolean {
    return this.client.write(message);
  }

  public disconnect(): void {
    this.client.end(() => {
      this._logger.info("Disconnected from server", TcpClient.name);
      this._connected = false;
    });
  }

  private addConnectionEventListenersAfterConnect(): void {
    this.client.on(Socket.EVENT_ON_CLOSE, () => {
      this._logger.info("Connection closed");
      this._connected = false;
    });
    this.client.on(Socket.EVENT_ON_DATA, (data: Buffer) => {
      this.onData(data);
    });
  }

  private addConnectionEventListenersBeforeConnect(): void {
    this.client.on(Socket.EVENT_ON_ERROR, (err) => {
      this._logger.error(`Connection error ${err}`, TcpClient.name);
      this._connected = false;
    });
    this.client.on(Socket.EVENT_ON_TIMEOUT, () => {
      this._logger.error(`Connection timeout`, TcpClient.name);
      this._connected = false;
    });
  }

  private onData(data: Buffer): void {
    this._logger.info("new data received");

    if (data.length === 1 && data[0] === LINE_FEED) {
      this._logger.warn(`Line feed received.`, TcpClient.name);

      return;
    }

    const lastIndex = data.length - 1;

    if (data[lastIndex] === LINE_FEED) {
      data = data.subarray(0, -1);
    }

    const messageLine = data.toString();

    this._logger.debug(`Message: ${messageLine}`, TcpClient.name);

    this._onData.run(messageLine, this._vehicle, 0);
  }
}
