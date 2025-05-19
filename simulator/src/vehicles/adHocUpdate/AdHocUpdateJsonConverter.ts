import { LoggerInterface } from "../../../../connector/common/src/logger/LoggerInterface.ts";

import { AdHocUpdate } from "./AdHocUpdate.ts";

export class AdHocUpdateJsonConverter {
  private _logger: LoggerInterface;

  constructor(logger: LoggerInterface) {
    this._logger = logger;
  }

  public toJson(adHocUpdate: AdHocUpdate): string {
    return JSON.stringify({
      vehicleId: adHocUpdate.vehicleId,
      trackingId: adHocUpdate.trackingId,
      paketType: adHocUpdate.paketType,
      protocol: adHocUpdate.protocol,
      protocolVersion: adHocUpdate.protocolVersion,
    });
  }

  public fromJson(json: string): AdHocUpdate | undefined {
    let obj: unknown;

    try {
      obj = JSON.parse(json);
    } catch (e) {
      this._logger.error(
        `Error parsing JSON: ${e}`,
        AdHocUpdateJsonConverter.name,
      );

      return undefined;
    }

    if (!this.isValidAdHocUpdate(obj)) {
      return undefined;
    }

    return new AdHocUpdate(
      obj.vehicleId,
      obj.trackingId,
      obj.protocolVersion,
      obj.protocol,
      obj.paketType,
    );
  }

  private isValidAdHocUpdate(obj: unknown): obj is AdHocUpdate {
    return (
      typeof obj === "object" &&
      obj !== null &&
      typeof (obj as AdHocUpdate).vehicleId === "number" &&
      typeof (obj as AdHocUpdate).trackingId === "string" &&
      typeof (obj as AdHocUpdate).paketType === "string" &&
      typeof (obj as AdHocUpdate).protocol === "string" &&
      typeof (obj as AdHocUpdate).protocolVersion === "string"
    );
  }
}
