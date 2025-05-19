import { ScenarioInterface } from "./ScenarioInterface.ts";

export class DefaultScenario implements ScenarioInterface {
  private _vehiclesReservedAtSameTimePercentage = 0.2;

  /**
   * urban commuting
   * @private
   */
  private _kickScooterRentalDuration = [720, 900];

  /**
   * urban commuting
   * @private
   */
  private _kickScooterRentalMileage = [1000, 2000];

  /**
   * How any vehicles will be added at the same time if there are not enough vehicles reserved according to AtSameTimePercentage
   * @private
   */
  private _addAtSameTime: number = 1;

  public getRandomKickScooterRentalDuration(): number {
    return Math.floor(
      Math.random() *
        (this._kickScooterRentalDuration[1] -
          this._kickScooterRentalDuration[0] +
          1) +
        this._kickScooterRentalDuration[0],
    );
  }

  public getRandomKickScooterRentalMileage(): number {
    return Math.floor(
      Math.random() *
        (this._kickScooterRentalMileage[1] -
          this._kickScooterRentalMileage[0] +
          1) +
        this._kickScooterRentalMileage[0],
    );
  }

  public get vehiclesReservedAtSameTimePercentage(): number {
    return this._vehiclesReservedAtSameTimePercentage;
  }

  public get addAtSameTime(): number {
    return this._addAtSameTime;
  }
}
