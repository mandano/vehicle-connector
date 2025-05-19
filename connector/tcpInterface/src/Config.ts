import dotenv from "dotenv";

import { LogLevels } from "../../common/src/logger/LogLevels.ts";

dotenv.config();

export class Config {
  private readonly _allowAutomaticVehicleCreation: boolean;
  private readonly _logLevel: string;
  private readonly _applicationName: string;

  constructor() {
    this._allowAutomaticVehicleCreation =
      process.env.ALLOW_AUTOMATIC_VEHICLE_CREATION === "true";
    this._logLevel = process.env.LOG_LEVEL ?? LogLevels.DEBUG;
    this._applicationName = process.env.APPLICATION_NAME ?? "tcpInterface";
  }

  get allowAutomaticVehicleCreation(): boolean {
    return this._allowAutomaticVehicleCreation;
  }

  get logLevel(): string {
    return this._logLevel;
  }

  get applicationName(): string {
    return this._applicationName;
  }
}
