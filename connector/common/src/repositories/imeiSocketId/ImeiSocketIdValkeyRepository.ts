import type Imei from "../../vehicle/components/iot/network/protocol/Imei.ts";
import ValkeyAdapterInterface from "../../adapters/valkey/ValkeyAdapterInterface.ts";
import LoggerInterface from "../../logger/LoggerInterface.ts";

import ImeiSocketIdRepositoryInterface from "./ImeiSocketIdRepositoryInterface.ts";

export default class ImeiSocketIdValkeyRepository
  implements ImeiSocketIdRepositoryInterface
{
  private readonly _keyPrefix: string = "imei_socket";

  constructor(
    private readonly _valkeyAdapter: ValkeyAdapterInterface,
    private readonly _logger: LoggerInterface,
  ) {}

  private getImeiKey(imei: Imei): string {
    return `${this._keyPrefix}:imei:${imei}`;
  }

  private getSocketIdKey(socketId: string): string {
    return `${this._keyPrefix}:socket:${socketId}`;
  }

  /**
   * TODO: Will overwrite existing mapping. This should not never happen in the first place. Check if better approaches applicable.
   *
   * @param imei
   * @param socketId
   */
  public async create(imei: Imei, socketId: string): Promise<boolean> {
    const existingSocketIdInImeiKey = await this.getSocketIdInImeiKey(imei);

    if (existingSocketIdInImeiKey) {
      this._logger.error("Deleting existingSocketIdInImeiKey", ImeiSocketIdValkeyRepository.name);
      // TODO: in which scenarios can this happen? should not happen? rather cancel creation?

      await this._valkeyAdapter.del(
        this.getSocketIdKey(existingSocketIdInImeiKey),
      );
    }

    const existingImeiInSocketIdKey = await this.getImeiInSocketIdKey(socketId);

    if (existingImeiInSocketIdKey) {
      this._logger.error("Deleting existingImeiInSocketIdKey", ImeiSocketIdValkeyRepository.name);
      // TODO: in which scenarios can this happen? should not happen? rather cancel creation?

      await this._valkeyAdapter.del(this.getImeiKey(existingImeiInSocketIdKey));
    }

    const imeiKey = this.getImeiKey(imei);
    const socketKey = this.getSocketIdKey(socketId);

    return await this._valkeyAdapter.multiSet([
      { key: imeiKey, value: socketId },
      { key: socketKey, value: imei },
    ]);
  }

  public async delete(imei: Imei): Promise<boolean> {
    const socketId = await this.getSocketIdInImeiKey(imei);

    if (!socketId) {
      return false;
    }

    const imeiKey = this.getImeiKey(imei);
    const socketKey = this.getSocketIdKey(socketId);

    return await this._valkeyAdapter.multiDel([imeiKey, socketKey]);
  }

  public async deleteBySocketId(
    socketId: string,
  ): Promise<boolean | undefined> {
    const imei = await this.getImeiInSocketIdKey(socketId);

    if (!imei) {
      return false;
    }

    return this.delete(imei);
  }

  public async getImeiInSocketIdKey(
    socketId: string,
  ): Promise<Imei | undefined> {
    const socketKey = this.getSocketIdKey(socketId);
    // TODO: use proper typeguard
    return (await this._valkeyAdapter.get(socketKey)) as Imei | undefined;
  }

  public async getSocketIdInImeiKey(imei: Imei): Promise<string | undefined> {
    const imeiKey = this.getImeiKey(imei);
    // TODO: use proper typeguard
    return (await this._valkeyAdapter.get(imeiKey)) as string | undefined;
  }

  public async getSocketId(socketId: string): Promise<string | undefined> {
    const socketIdKey = this.getSocketIdKey(socketId);
    // TODO: use proper typeguard
    return (await this._valkeyAdapter.get(socketIdKey)) as string | undefined;
  }

  private async getAll(): Promise<Map<Imei, string>> {
    const pattern = `${this._keyPrefix}:imei:*`;
    const keys = await this._valkeyAdapter.scan(pattern);

    const map = new Map<Imei, string>();

    for (const key of keys) {
      const imei = key.replace(`${this._keyPrefix}:imei:`, "") as Imei;
      const socketId = (await this._valkeyAdapter.get(key)) as string;

      if (socketId) {
        map.set(imei, socketId);
      }
    }

    return map;
  }

  public async deleteAll(): Promise<boolean> {
    const allKeys = await this._valkeyAdapter.scan(`${this._keyPrefix}:*`);

    if (allKeys.length === 0) {
      return false;
    }

    return await this._valkeyAdapter.multiDel(allKeys);
  }

  /**
   * TODO: adjust to not get too many entries
   */
  public async getCount(): Promise<number | undefined> {
    let keys: string[];

    try {
      keys = await this._valkeyAdapter.scan(`${this._keyPrefix}:imei:*`);
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error)
      this._logger.error(errorMsg, ImeiSocketIdValkeyRepository.name);

      return undefined;
    }

    return keys.length;
  }
}
