import SendActionRequestInterface from "../model/actions/SendActionRequestInterface.ts";

import VehicleToObjectContext from "./vehicleToObject/VehicleToObject.ts";
import VehicleToDtoContext from "./vehicleToDto/_Context.ts";
import DtoToObject from "./dtoToObject/DtoToObject.ts";
import ObjectToDtoContext from "./objectToDto/_Context.ts";
import DtoToVehicleContext from "./dtoToVehicle/_Context.ts";

export default class Context {
  private _dtoToObject: DtoToObject | undefined;
  private _vehicleToDtoContext: VehicleToDtoContext | undefined;
  private _vehicleToObjectContext: VehicleToObjectContext | undefined;
  private _objectToDtoContext: ObjectToDtoContext | undefined;
  private _dtoToVehicleContext: DtoToVehicleContext | undefined;

  constructor(
    private readonly _sendActionRequest: SendActionRequestInterface,
  ) {}

  public dtoToObject(): DtoToObject {
    if (!this._dtoToObject) {
      this._dtoToObject = new DtoToObject();
    }
    return this._dtoToObject;
  }

  public vehicleToDto(): VehicleToDtoContext {
    if (!this._vehicleToDtoContext) {
      this._vehicleToDtoContext = new VehicleToDtoContext();
    }
    return this._vehicleToDtoContext;
  }

  public vehicleToObject(): VehicleToObjectContext {
    if (!this._vehicleToObjectContext) {
      this._vehicleToObjectContext = new VehicleToObjectContext(
        this.vehicleToDto().vehicleToDto(),
        this.dtoToObject(),
      );
    }
    return this._vehicleToObjectContext;
  }

  public objectToDto(): ObjectToDtoContext {
    if (!this._objectToDtoContext) {
      this._objectToDtoContext = new ObjectToDtoContext();
    }
    return this._objectToDtoContext;
  }

  public dtoToVehicle(): DtoToVehicleContext {
    if (!this._dtoToVehicleContext) {
      this._dtoToVehicleContext = new DtoToVehicleContext(
        this._sendActionRequest,
      );
    }
    return this._dtoToVehicleContext;
  }
}
