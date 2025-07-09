import SocketInterface from "tcpinterface/src/socket/SocketInterface.ts";

export default class FakeSocket implements SocketInterface {
  private readonly _remoteAddress: string | undefined;
  private _onEndCallback: (() => void) | undefined;
  private _onTimeoutCallback: (() => void) | undefined;
  private _onDataCallback: ((data: Buffer) => void) | undefined;

  constructor(remoteAddress?: string) {
    this._remoteAddress = remoteAddress;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  write(data: string): boolean {
    return true;
  }

  onEnd(onEnd: () => void): void {
    this._onEndCallback = onEnd;
  }

  onTimeout(onTimeout: () => void): void {
    this._onTimeoutCallback = onTimeout;
  }

  onData(onData: (data: Buffer) => void): void {
    this._onDataCallback = onData;
  }

  get remoteAddress(): string | undefined {
    return this._remoteAddress;
  }

  triggerEnd(): void {
    if (this._onEndCallback) {
      this._onEndCallback();
    }
  }

  triggerTimeout(): void {
    if (this._onTimeoutCallback) {
      this._onTimeoutCallback();
    }
  }

  triggerData(data: Buffer): void {
    if (this._onDataCallback) {
      this._onDataCallback(data);
    }
  }
}