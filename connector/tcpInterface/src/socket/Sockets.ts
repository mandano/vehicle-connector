import { SocketInterface } from "./SocketInterface.ts";

export class Sockets {
  private readonly _sockets: Map<string, SocketInterface>;

  constructor() {
    this._sockets = new Map<string, SocketInterface>();
  }

  public get(key: string){
    return this._sockets.get(key);
  }

  public set(key: string, value: SocketInterface): Map<string, SocketInterface> {
    return this._sockets.set(key, value);
  }

  public delete(key: string): boolean {
    return this._sockets.delete(key);
  }

  public getSocketKeyByValue(socket: SocketInterface): string | undefined {
    let foundKey: string | undefined;

    this._sockets.forEach((value, key) => {
      if (value === socket) {
        foundKey = key;
      }
    });

    return foundKey;
  }

  get sockets(): Map<string, SocketInterface> {
    return this._sockets;
  }
}
