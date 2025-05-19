import { Imei } from "../../../../../../../../connector/common/src/vehicle/components/iot/network/protocol/Imei.ts";

export class SimpleUpdate {
  public static messageLineKey = "UPDATE_SIMPLE_SCOOTER";

  constructor(
    private _latitude: number,
    private _latitudeOriginatedAt: Date,
    private _longitude: number,
    private _longitudeOriginatedAt: Date,
    private _imei: Imei,
    private _protocolVersion: string,
    private _originatedAt: Date,
    private _trackingId?: string,
  ) {}

  get latitude(): number {
    return this._latitude;
  }

  get latitudeOriginatedAt(): Date {
    return this._latitudeOriginatedAt;
  }

  get longitude(): number {
    return this._longitude;
  }

  get longitudeOriginatedAt(): Date {
    return this._longitudeOriginatedAt;
  }

  get imei(): Imei {
    return this._imei;
  }

  get protocolVersion(): string {
    return this._protocolVersion;
  }

  get originatedAt(): Date {
    return this._originatedAt;
  }

  get trackingId(): string | undefined {
    return this._trackingId;
  }
}

export default SimpleUpdate;
