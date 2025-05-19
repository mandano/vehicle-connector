import { Imei } from "../../../../../../../../connector/common/src/vehicle/components/iot/network/protocol/Imei.ts";

export class SimpleUpdate {
  public static messageLineKey = "UPDATE_SIMPLE_SCOOTER";

  constructor(
    private _imei: Imei,
    private _protocolVersion: string,
    private _originatedAt: Date,
    private _latitude?: number,
    private _latitudeOriginatedAt?: Date,
    private _longitude?: number,
    private _longitudeOriginatedAt?: Date,
    private _mileage?: number,
    private _mileageOriginatedAt?: Date,
    private _energy?: number,
    private _energyOriginatedAt?: Date,
    private _speed?: number,
    private _speedOriginatedAt?: Date,
    private _trackingId?: string,
  ) {}

  get latitude(): number | undefined {
    return this._latitude;
  }

  get latitudeOriginatedAt(): Date | undefined {
    return this._latitudeOriginatedAt;
  }

  get longitude(): number | undefined {
    return this._longitude;
  }

  get longitudeOriginatedAt(): Date | undefined {
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

  get mileage(): number | undefined {
    return this._mileage;
  }

  get mileageOriginatedAt(): Date | undefined {
    return this._mileageOriginatedAt;
  }

  get energy(): number | undefined {
    return this._energy;
  }

  get energyOriginatedAt(): Date | undefined {
    return this._energyOriginatedAt;
  }

  get speed(): number | undefined {
    return this._speed;
  }

  get speedOriginatedAt(): Date | undefined {
    return this._speedOriginatedAt;
  }
}

export default SimpleUpdate;
