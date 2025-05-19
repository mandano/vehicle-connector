import fs from "fs";

import { LoggerInterface } from "../logger/LoggerInterface.ts";

import { FileSystemAdapterInterface } from "./FileSystemAdapterInterface.ts";

export class FileSystemAdapter implements FileSystemAdapterInterface {
  private readonly encoding = "utf-8";
  private _logger: LoggerInterface;

  constructor(logger: LoggerInterface) {
    this._logger = logger;
  }

  public readData(path: string): unknown[] {
    if (!fs.existsSync(path)) {
      return [];
    }
    const rawData = fs.readFileSync(path, this.encoding);
    try {
      return JSON.parse(rawData);
    } catch (e) {
      this._logger.error(`Error parsing JSON from file: ${path}, error: ${e}`);

      return [];
    }
  }

  public writeData(data: unknown, path: string): boolean {
    try {
      fs.writeFileSync(path, JSON.stringify(data, null, 2));
      return true;
    } catch (error) {
      this._logger.error(
        `Error writing JSON to file: ${path}, error: ${error}`,
      );
      return false;
    }
  }
}

export default FileSystemAdapter;

