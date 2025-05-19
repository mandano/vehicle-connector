import { FileSystemAdapterInterface } from "../../src/adapters/FileSystemAdapterInterface.ts";

export class FakeFileSystemAdapter implements FileSystemAdapterInterface {
  private readonly _dataStore: { [key: string]: unknown[] } = {};

  constructor(dataStore: { [key: string]: unknown[] }) {
    this._dataStore = dataStore;
  }

  public readData(path: string): unknown[] {
    return this._dataStore[path] || [];
  }

  public writeData(data: unknown, path: string): boolean {
    this._dataStore[path] = data as unknown[];
    return true;
  }
}
