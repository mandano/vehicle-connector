import Vehicle from "../../Vehicle.ts";
import DtoToObject from "../dtoToObject/DtoToObject.ts";
import VehicleToDto from "../vehicleToDto/VehicleToDto.ts";
import VehicleStorageObject from "../../VehicleStorageObject.ts";

// TODO: rename class
export default class VehicleToObject {
  constructor(
    private _vehicleToDto: VehicleToDto,
    private _dtoToObject: DtoToObject,
  ) {}

  public run(vehicle: Vehicle): VehicleStorageObject | undefined {
    const vehicleDto = this._vehicleToDto.run(vehicle);

    if (vehicleDto === undefined) {
      return undefined;
    }

    return this._dtoToObject.run(vehicleDto);
  }
}
