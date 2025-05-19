import { OrphanedSocket } from "../entities/OrphanedSocket.ts";
import { FileSystemAdapterInterface } from "../adapters/FileSystemAdapterInterface.ts";
import { SocketInterface } from "../../../tcpInterface/src/socket/SocketInterface.ts";

import { OrphanedSocketRepositoryInterface } from "./OrphanedSocketRepositoryInterface.ts";

export class OrphanedSocketFileSystemRepository
  implements OrphanedSocketRepositoryInterface
{
  private readonly filePath: string;
  private readonly applicationName: string;
  private _fileSystemAdapter: FileSystemAdapterInterface;

  constructor(
    filePath: string,
    applicationName: string,
    fileSystemAdapter: FileSystemAdapterInterface,
  ) {
    this.filePath = filePath;
    this.applicationName = applicationName;
    this._fileSystemAdapter = fileSystemAdapter;
  }

  private isOrphanedSockets(data: unknown[]): data is OrphanedSocket[] {
    return (
      (data[0] as OrphanedSocket).id !== undefined &&
      (data[0] as OrphanedSocket).ip !== undefined &&
      (data[0] as OrphanedSocket).createdAt !== undefined
    );
  }

  public create(socket: OrphanedSocket): boolean {
    const data = this._fileSystemAdapter.readData(this.filePath);

    data.push(socket);
    this._fileSystemAdapter.writeData(data, this.filePath);
    return true;
  }

  public createBySocket(socket: SocketInterface, socketId: string): boolean {
    const orphanedSocketName = `${this.applicationName}${socketId}`;
    const remoteAddress = socket.remoteAddress ?? "";

    return this.create(
      new OrphanedSocket(orphanedSocketName, remoteAddress, new Date()),
    );
  }

  public findById(id: string): OrphanedSocket | undefined {
    const data = this._fileSystemAdapter.readData(this.filePath);

    if (data.length === 0) {
      return undefined;
    }

    const isOrphanedSockets = this.isOrphanedSockets(data);

    if (!isOrphanedSockets) {
      return undefined;
    }

    return data.find((socket) => socket.id === id);
  }

  public deleteAll(): boolean {
    this._fileSystemAdapter.writeData([], this.filePath);
    return true;
  }

  public delete(id: string): boolean {
    const data = this._fileSystemAdapter.readData(this.filePath);

    const isOrphanedSockets = this.isOrphanedSockets(data);

    if (!isOrphanedSockets) {
      return false;
    }

    const filteredData = data.filter((socket) => socket.id !== id);

    if (filteredData.length !== data.length) {
      this._fileSystemAdapter.writeData(filteredData, this.filePath);
      return true;
    }

    return false;
  }

  public deleteBySocketCount(socketId: string): boolean {
    return this.delete(this.getIdBySocketCount(socketId));
  }

  private getIdBySocketCount(socketId: string): string {
    return `${this.applicationName}${socketId}`;
  }
}
