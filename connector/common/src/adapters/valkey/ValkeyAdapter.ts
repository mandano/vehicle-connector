import { ChainableCommander, CommonRedisOptions, Redis } from "iovalkey";

import LoggerInterface from "../../logger/LoggerInterface.ts";

import ValkeyAdapterInterface from "./ValkeyAdapterInterface.ts";
import ValkeyAdapterOptions from "./ValkeyAdapterOptions.ts";

export default class ValkeyAdapter implements ValkeyAdapterInterface {
  private readonly _client: Redis;

  constructor(
    private readonly _logger: LoggerInterface,
    options?: ValkeyAdapterOptions,
  ) {
    const redisOptions: CommonRedisOptions = {
      ...options,
      lazyConnect: true,
    };

    this._client = new Redis(redisOptions);
  }

  public async connect(): Promise<void> {
    return this._client.connect();
  }

  async get(key: string): Promise<unknown | undefined> {
    let value: string | null;

    try {
      value = await this._client.get(key);
    } catch (error) {
      console.error(`Error getting key ${key} from Valkey:`, error);
      return undefined;
    }

    if (value === null) return undefined;

    try {
      return JSON.parse(value);
    } catch {
      this._logger.error(
        `Error parsing value for key ${key} from Valkey:`,
        `Value: ${value}`,
      );
      return undefined;
    }
  }

  async set(key: string, value: unknown): Promise<boolean> {
    const strValue = typeof value === "string" ? value : JSON.stringify(value);
    try {
      await this._client.set(key, strValue);
    } catch (error) {
      this._logger.error(
        `Error setting key ${key} in Valkey:`,
        error instanceof Error ? error.message : String(error),
      );
      return false;
    }
    return true;
  }

  async del(key: string): Promise<boolean> {
    let result: number;
    try {
      result = await this._client.del(key);
    } catch (error) {
      this._logger.error(
        `Error deleting key ${key} from Valkey:`,
        error instanceof Error ? error.message : String(error),
      );
      return false;
    }

    return result > 0;
  }

  public async scan(pattern: string): Promise<string[]> {
    let cursor = "0";
    let keys: string[] = [];
    do {
      const scanResult = await this.triggerScan(cursor, pattern);

      if (scanResult === undefined) {
        return [];
      }

      cursor = scanResult[0];
      keys = keys.concat(scanResult[1]);
    } while (cursor !== "0");
    return keys;
  }

  private async triggerScan(
    cursor: string,
    pattern: string,
  ): Promise<[nextCursor: string, foundKeys: string[]] | undefined> {
    try {
      return await this._client.scan(cursor, "MATCH", pattern, "COUNT", 100);
    } catch (error) {
      this._logger.error(
        `Error scanning keys with pattern ${pattern}:`,
        error instanceof Error ? error.message : String(error),
      );
      return undefined;
    }
  }

  async close(): Promise<boolean> {
    try {
      await this._client.quit();
      return true;
    } catch (error) {
      this._logger.error(
        "Error closing Valkey connection:",
        error instanceof Error ? error.message : String(error),
      );
      return false;
    }
  }

  public async multiSet(
    keyValues: {
      key: string;
      value: unknown;
    }[],
  ): Promise<boolean> {
    let multi: ChainableCommander | undefined = this._client.multi();
    multi = this.setMultiSet(multi, keyValues);

    if (multi === undefined) return false;

    try {
      await multi.exec();
      return true;
    } catch (error) {
      this._logger.error(
        "Error executing multi command in Valkey:",
        error instanceof Error ? error.message : String(error),
      );
      return false;
    }
  }

  private setMultiSet(
    multi: ChainableCommander,
    keyValues: {
      key: string;
      value: unknown;
    }[],
  ): ChainableCommander | undefined {
    for (const keyValue of keyValues) {
      let stringifiedValue: string;
      try {
        stringifiedValue = JSON.stringify(keyValue.value);
      } catch (error) {
        this._logger.error(
          `Error stringifying value for key ${keyValue.key}:`,
          error instanceof Error ? error.message : String(error),
        );
        return undefined;
      }

      multi.set(keyValue.key, stringifiedValue);
    }

    return multi;
  }
}
