import VehicleRepositoryInterface from "../../src/repositories/VehicleRepositoryInterface.ts";
import {
  typeNames as modelTypeNames,
  types as VehicleModelTypes,
} from "../../src/vehicle/model/models/types.ts";
import { JsonVehicle } from "../../src/vehicle/json/JsonVehicle.ts";
import { Vehicle } from "../../src/vehicle/Vehicle.ts";
import { Imei } from "../../src/vehicle/components/iot/network/protocol/Imei.ts";
import ContainsIot from "../../src/vehicle/components/iot/ContainsIot.ts";
import ContainsNetwork from "../../src/vehicle/components/iot/network/ContainsNetwork.ts";

export class FakeVehicleFileSystemRepository
  implements VehicleRepositoryInterface
{
  private readonly _createReturnValue: number | undefined = undefined;
  private readonly _findByIdJsonReturnValue: JsonVehicle | undefined =
    undefined;
  private readonly _findByIdReturnValue: Vehicle | undefined = undefined;
  private readonly _updateModelNameReturnValue: boolean | void = undefined;
  private readonly _updateByImeiReturnValue: boolean = true;
  private readonly _findByImeiReturnValue: Vehicle | undefined = undefined;
  private readonly _findByImeiJsonReturnValue: JsonVehicle | undefined =
    undefined;
  private readonly _vehicles: Vehicle[] = [];

  constructor(options?: {
    vehicles?: Vehicle[];
    createReturnValue?: number;
    findByIdJsonReturnValue?: JsonVehicle;
    findByIdReturnValue?: Vehicle;
    updateModelNameReturnValue?: boolean | void;
    updateByImeiReturnValue?: boolean | void;
    findByImeiReturnValue?: Vehicle;
    findByImeiJsonReturnValue?: JsonVehicle;
  }) {
    if (options === undefined) {
      return;
    }

    this._vehicles = options.vehicles ?? this._vehicles;
    this._createReturnValue =
      options.createReturnValue ?? this._createReturnValue;
    this._findByIdJsonReturnValue =
      options.findByIdJsonReturnValue ?? this._findByIdJsonReturnValue;
    this._findByIdReturnValue =
      options.findByIdReturnValue ?? this._findByIdReturnValue;
    this._updateModelNameReturnValue =
      options.updateModelNameReturnValue ?? this._updateModelNameReturnValue;
    this._updateByImeiReturnValue =
      options.updateByImeiReturnValue ?? this._updateByImeiReturnValue;
    this._findByImeiReturnValue =
      options.findByImeiReturnValue ?? this._findByImeiReturnValue;
    this._findByImeiJsonReturnValue =
      options.findByImeiJsonReturnValue ?? this._findByImeiJsonReturnValue;
  }

  get vehicles(): Vehicle[] {
    return this._vehicles;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public create(model: VehicleModelTypes): number | undefined {
    return this._createReturnValue;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public findByIdJson(id: number): JsonVehicle | undefined {
    return this._findByIdJsonReturnValue;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public findById(id: number): Vehicle | undefined {
    return this._findByIdReturnValue;
  }

  public updateModelName(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    id: number,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    modelName: modelTypeNames,
  ): boolean | void {
    return this._updateModelNameReturnValue;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public updateByImei(imei: Imei, model: VehicleModelTypes): boolean {
    return this._updateByImeiReturnValue;
  }

  public findByImei(imei: Imei): Vehicle | undefined {
    return this._vehicles.find((vehicle) => {
      if (
        ContainsIot.run(vehicle.model) === false ||
        vehicle.model.ioT === undefined
      ) {
        return false;
      }

      if (
        ContainsNetwork.run(vehicle.model.ioT) === false ||
        vehicle.model.ioT.network === undefined
      ) {
        return false;
      }

      for (const connectionModule of vehicle.model.ioT.network
        .connectionModules) {
        if (connectionModule.imei === imei) {
          return true;
        }
      }
      return false;
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public findByImeiJson(imei: Imei): JsonVehicle | undefined {
    return this._findByImeiJsonReturnValue;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public findAll(from: number, to: number): Vehicle[] {
    return this._vehicles;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public findAllJson(from: number, to: number): JsonVehicle[] {
    return [];
  }
}
