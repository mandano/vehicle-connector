import { SocketInterface } from "../../src/socket/SocketInterface.ts";

export class SocketFake implements SocketInterface {
  private readonly _returnWrite: boolean;

    constructor(returnWrite?: boolean) {
        this._returnWrite = returnWrite ?? false;
    }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onData(onData: (data: Buffer) => void): void {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onEnd(onEnd: () => void): void {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onTimeout(onTimeout: () => void): void {}

  get remoteAddress(): string | undefined {
    return undefined;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  write(data: string): boolean {
    return this._returnWrite;
  }
}
