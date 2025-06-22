import { Imei } from "../vehicle/components/iot/network/protocol/Imei.ts";
import { FileSystemAdapterInterface } from "../adapters/FileSystemAdapterInterface.ts";

import { ImeiSocketIdRepositoryInterface } from "./ImeiSocketIdRepositoryInterface.ts";

export class ImeiSocketIdFileRepository implements ImeiSocketIdRepositoryInterface {
  private readonly filePath: string;
  private _fileSystemAdapter: FileSystemAdapterInterface;

  constructor(filePath: string, fileSystemAdapter: FileSystemAdapterInterface) {
    this.filePath = filePath;
    this._fileSystemAdapter = fileSystemAdapter;
  }

  create(imei: Imei, socketId: string): Map<Imei, string> {
    let existingData = this.getAll();
    if (existingData === undefined) {
      existingData = new Map<Imei, string>();
    }

    const map = existingData.set(imei, socketId);

    this._fileSystemAdapter.writeData([...map.entries()], this.filePath);

    return map;
  }

  delete(imei: Imei): boolean | undefined {
    const existingData = this.getAll();

    if (existingData === undefined) {
      return undefined;
    }

    if(existingData.delete(imei) === false) {
      return false;
    }

    this._fileSystemAdapter.writeData([...existingData.entries()], this.filePath);

    return true;
  }

  deleteBySocketId(socketId: string): boolean | undefined {
    const existingData = this.getAll();

    if (existingData === undefined) {
      return undefined;
    }

    let foundKey: Imei | undefined;
    existingData.forEach((value, key) => {
      if (value === socketId) {
        foundKey = key;
      }
    });

    if (foundKey === undefined) {
      return false;
    }

    return existingData.delete(foundKey);
  }

  getImei(socketId: string): Imei | undefined {
    let foundKey: Imei | undefined;

    const existingData = this.getAll();

    if (existingData === undefined) {
      return undefined;
    }

    existingData.forEach((value, key) => {
      if (value === socketId) {
        foundKey = key;
      }
    });

    if (foundKey === undefined) {
      return undefined;
    }

    return foundKey;
  }

  getSocketId(imei: string): string | undefined {
    const existingData = this.getAll();

    if (existingData === undefined) {
      return undefined;
    }

    return existingData.get(imei);
  }

  public getAll(): Map<Imei, string> | undefined {
    const imeiSocketIds = this._fileSystemAdapter.readData(this.filePath);

    if (!this.isImeiSocketIdLinks(imeiSocketIds)) {
      return undefined;
    }

    return new Map<Imei, string>(imeiSocketIds);
  }

  public deleteAll(): void {
    const imeiSocketIds = this.getAll();

    if (imeiSocketIds === undefined) {
      return;
    }

    for (const imeiSocketId of imeiSocketIds) {
      this.delete(imeiSocketId[0]);
    }
  }

  private isImeiSocketIdLinks(data: unknown[]): data is [Imei, string][] {
    if (!Array.isArray(data)) {
      return false;
    }

    return data.every(
      (item) =>
        Array.isArray(item) &&
        item.length === 2 &&
        typeof item[0] === "string" &&
        typeof item[1] === "string",
    );
  }
}

export default ImeiSocketIdFileRepository;
