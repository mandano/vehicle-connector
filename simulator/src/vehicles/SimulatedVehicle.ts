import { Vehicle } from "../../../connector/common/src/vehicle/Vehicle.ts";
import { Reservation } from "../reservations/Reservation.ts";
import { LoggerInterface } from "../../../connector/common/src/logger/LoggerInterface.ts";

import { Location } from "./position/Location.ts";
import { SendUpdate } from "./sendToConnector/update/SendUpdate.ts";
import { VehicleUserApiActions } from "./VehicleUserApiActions.ts";
import { AdHocUpdate } from "./adHocUpdate/AdHocUpdate.ts";
import { AdHocPublisher } from "./adHocUpdate/AdHocPublisher.ts";

export class SimulatedVehicle {
  private readonly _vehicle: Vehicle;
  private _reservation: Reservation | undefined;
  private readonly _location: Location;
  private _updateLastPublished?: Date;
  private _sendUpdate: SendUpdate;
  private readonly _vehicleUserApiActions: VehicleUserApiActions;

  constructor(
    vehicle: Vehicle,
    location: Location,
    sendUpdate: SendUpdate,
    vehicleUserApiActions: VehicleUserApiActions,
    private _logger: LoggerInterface,
    private _adHocPublisher: AdHocPublisher,
  ) {
    this._vehicle = vehicle;
    this._location = location;
    this._sendUpdate = sendUpdate;
    this._vehicleUserApiActions = vehicleUserApiActions;
  }

  get vehicleUserApiActions(): VehicleUserApiActions {
    return this._vehicleUserApiActions;
  }

  get vehicle(): Vehicle {
    return this._vehicle;
  }

  get reservation(): Reservation | undefined {
    return this._reservation;
  }

  set reservation(reservation: Reservation | undefined) {
    this._reservation = reservation;
  }

  get location(): Location {
    return this._location;
  }

  get updateLastPublished(): Date | undefined {
    return this._updateLastPublished;
  }

  set updateLastPublished(date: Date | undefined) {
    this._updateLastPublished = date;
  }

  public async publishUpdate(): Promise<boolean | undefined> {
    await this._sendUpdate.run(this.vehicle);

    this._updateLastPublished = new Date();

    return true;
  }

  public async publishAdHocMessageLine(
    adHocUpdate: AdHocUpdate,
  ): Promise<boolean> {
    const published = await this._adHocPublisher.run(adHocUpdate, this.vehicle);

    if (published === undefined) {
      return false;
    }

    return published;
  }
}

export default SimulatedVehicle;
