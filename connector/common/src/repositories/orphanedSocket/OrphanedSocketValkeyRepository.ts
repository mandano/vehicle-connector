import SocketInterface from "tcpinterface/src/socket/SocketInterface.ts";

import OrphanedSocket from "../../entities/OrphanedSocket.ts";
import ValkeyAdapterInterface from "../../adapters/valkey/ValkeyAdapterInterface.ts";
import LoggerInterface from "../../logger/LoggerInterface.ts";
import IsOrphanedSocket from "../../entities/orphanedSocket/IsOrphanedSocket.ts";

import OrphanedSocketRepositoryInterface from "./OrphanedSocketRepositoryInterface.ts";

export default class OrphanedSocketValkeyRepository
  implements OrphanedSocketRepositoryInterface
{
  private readonly _keyPrefix: string = "orphaned_socket";

  constructor(
    private readonly _valkeyAdapter: ValkeyAdapterInterface,
    private readonly _logger: LoggerInterface,
  ) {}

  private getSocketKey(id: string): string {
    return `${this._keyPrefix}:${id}`;
  }

  public async create(socket: OrphanedSocket): Promise<boolean> {
    const key = this.getSocketKey(socket.id);

    try {
      return await this._valkeyAdapter.set(key, {
        id: socket.id,
        ip: socket.ip,
        applicationName: socket.applicationName,
        createdAt: socket.createdAt.toISOString(),
      });
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      this._logger.error(errorMsg, OrphanedSocketValkeyRepository.name);
      return false;
    }
  }

  public async createBySocket(
    socket: SocketInterface,
    socketId: string,
    appName: string,
  ): Promise<boolean> {
    const remoteAddress = socket.remoteAddress ?? "";

    return this.create(
      new OrphanedSocket(socketId, remoteAddress, appName, new Date()),
    );
  }

  private async findByKey(key: string): Promise<OrphanedSocket | undefined> {
    let data: unknown;

    try {
      data = await this._valkeyAdapter.get(key);
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      this._logger.error(errorMsg, OrphanedSocketValkeyRepository.name);
      return undefined;
    }

    if (!data) {
      return undefined;
    }

    if (!IsOrphanedSocket.run(data)) {
      return undefined;
    }

    return new OrphanedSocket(
      data.id,
      data.ip,
      data.applicationName,
      new Date(data.createdAt),
    );
  }

  public async findById(id: string): Promise<OrphanedSocket | undefined> {
    const key = this.getSocketKey(id);
    return await this.findByKey(key);
  }

  public async delete(id: string): Promise<boolean> {
    const key = this.getSocketKey(id);

    try {
      return await this._valkeyAdapter.del(key);
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      this._logger.error(errorMsg, OrphanedSocketValkeyRepository.name);
      return false;
    }
  }

  public async getAll(): Promise<OrphanedSocket[] | undefined> {
    const pattern = `${this._keyPrefix}:*`;
    let keys: string[] = [];

    try {
      keys = await this._valkeyAdapter.scan(pattern);
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      this._logger.error(errorMsg, OrphanedSocketValkeyRepository.name);
      return undefined;
    }

    if (keys.length === 0) {
      return [];
    }

    const sockets: OrphanedSocket[] = [];

    for (const key of keys) {
      const socket = await this.findByKey(key);

      if (!socket) {
        continue;
      }

      sockets.push(socket);
    }

    return sockets;
  }

  public async deleteAll(): Promise<boolean> {
    const pattern = `${this._keyPrefix}:*`;
    let keys: string[] = [];

    try {
      keys = await this._valkeyAdapter.scan(pattern);
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      this._logger.error(errorMsg, OrphanedSocketValkeyRepository.name);
      return false;
    }

    if (keys.length === 0) {
      return false;
    }

    try {
      return await this._valkeyAdapter.multiDel(keys);
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      this._logger.error(errorMsg, OrphanedSocketValkeyRepository.name);
      return false;
    }
  }

  public async deleteBySocketId(socketId: string): Promise<boolean> {
    return this.delete(socketId);
  }
}
