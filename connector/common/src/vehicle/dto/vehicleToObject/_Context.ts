import VehicleToDto from "../vehicleToDto/VehicleToDto.ts";
import DtoToObject from "../dtoToObject/DtoToObject.ts";

import VehicleToObject from "./VehicleToObject.ts";

export default class Context {
  private _vehicleToObject: VehicleToObject | undefined;

  constructor(
    private _vehicleDto: VehicleToDto,
    private _dtoToObject: DtoToObject,
  ) {}

  public vehicleToObject(): VehicleToObject {
    if (!this._vehicleToObject) {
      this._vehicleToObject = new VehicleToObject(
        this._vehicleDto,
        this._dtoToObject,
      );
    }
    return this._vehicleToObject;
  }
}
