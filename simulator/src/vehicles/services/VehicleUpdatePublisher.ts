import { SimulatedVehicle } from "../SimulatedVehicle.ts";
import { UpdatePosition } from "../update/UpdatePosition.ts";
import { UpdateSpeedometer } from "../update/UpdateSpeedometer.ts";
import { UpdateEnergy } from "../update/energy/UpdateEnergy.ts";
import { UpdateOdometer } from "../update/odometer/UpdateOdometer.ts";

export class VehicleUpdatePublisher {
  private _duringReservationUpdateInterval = 10 * 1000;
  private _outsideOfReservationUpdateInterval = 60 * 5 * 1000;
  private readonly _simulatedVehicles: SimulatedVehicle[];
  private _publishedCycles = 0;

  constructor(
    simulatedVehicles: SimulatedVehicle[],
    private _updatePosition: UpdatePosition,
    private _updateSpeedometer: UpdateSpeedometer,
    private _updateEnergy: UpdateEnergy,
    private _updateOdometer: UpdateOdometer,
    private _publishingCycles?: number,
  ) {
    this._simulatedVehicles = simulatedVehicles;
  }

  public async run() {
    while (
      this._publishingCycles === undefined ||
      this._publishedCycles < this._publishingCycles
    ) {
      await this.publish();
      await this.sleep();
    }
  }

  private sleep() {
    return new Promise((resolve) => {
      setTimeout(resolve, 1000);
    });
  }

  /**
   * Info: Message lines defined as "update" message lines even of different
   * type will be sent at the same time. See trace of publishUpdate().
   */
  public async publish(): Promise<void> {
    for (const vehicle of this._simulatedVehicles) {
      const updateLastPublished = vehicle.updateLastPublished;

      let sinceLastUpdate: number;
      if (updateLastPublished === undefined) {
        sinceLastUpdate = new Date().getTime() - new Date(0).getTime();
      } else {
        const now = new Date();
        sinceLastUpdate = now.getTime() - updateLastPublished.getTime();
      }

      const inReservation = vehicle.reservation !== undefined;

      if (
        inReservation &&
        sinceLastUpdate > this._duringReservationUpdateInterval
      ) {
        this._updatePosition.run(vehicle);
        this._updateSpeedometer.run(vehicle);
        this._updateEnergy.run(vehicle);
        this._updateOdometer.run(vehicle);

        await vehicle.publishUpdate();
      } else if (
        !inReservation &&
        sinceLastUpdate > this._outsideOfReservationUpdateInterval
      ) {
        this._updatePosition.run(vehicle);
        this._updateSpeedometer.run(vehicle);
        this._updateEnergy.run(vehicle);
        this._updateOdometer.run(vehicle);

        await vehicle.publishUpdate();
      }
    }
  }
}
