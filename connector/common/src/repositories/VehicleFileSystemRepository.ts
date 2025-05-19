import { FileSystemAdapterInterface } from "../adapters/FileSystemAdapterInterface.ts";
import { Vehicle } from "../vehicle/Vehicle.ts";
import { Imei } from "../vehicle/components/iot/network/protocol/Imei.ts";
import { JsonVehicle } from "../vehicle/json/JsonVehicle.ts";
import { JsonVehicleToVehicle } from "../vehicle/json/jsonVehicleToVehicle/JsonVehicleToVehicle.ts";
import { VehicleToJsonVehicle } from "../vehicle/json/vehicleToJsonVehicle/VehicleToJsonVehicle.ts";
import {
  typeNames as modelTypeNames,
  types as VehicleModelTypes,
} from "../vehicle/model/models/types.ts";
import ContainsIot from "../vehicle/components/iot/ContainsIot.ts";
import ContainsNetwork from "../vehicle/components/iot/network/ContainsNetwork.ts";

import VehicleRepositoryInterface from "./VehicleRepositoryInterface.ts";

export default class VehicleFileSystemRepository
  implements VehicleRepositoryInterface
{
  private readonly filePath: string;
  private _fileSystemAdapter: FileSystemAdapterInterface;
  private _vehicleToJsonVehicle: VehicleToJsonVehicle;
  private _jsonVehicleToVehicle: JsonVehicleToVehicle;

  constructor(
    filePath: string,
    fileSystemAdapter: FileSystemAdapterInterface,
    vehicleToJsonVehicle: VehicleToJsonVehicle,
    jsonVehicleToVehicle: JsonVehicleToVehicle,
  ) {
    this.filePath = filePath;
    this._fileSystemAdapter = fileSystemAdapter;
    this._vehicleToJsonVehicle = vehicleToJsonVehicle;
    this._jsonVehicleToVehicle = jsonVehicleToVehicle;
  }

  private isJsonVehicles(data: unknown[]): data is JsonVehicle[] {
    return (
      (data[0] as JsonVehicle).id !== undefined &&
      (data[0] as JsonVehicle).model !== undefined &&
      (data[0] as JsonVehicle).createdAt !== undefined
    );
  }

  public create(model: VehicleModelTypes): number | undefined {
    const data = this._fileSystemAdapter.readData(this.filePath);

    let highestId, newId = 0;

    if (data.length > 0) {
      const isVehicles = this.isJsonVehicles(data);

      if (!isVehicles) {
        return undefined;
      }

      highestId = data.reduce((prev, current) => {
        if (!current || current.id === undefined) {
          return prev;
        }
        return prev.id > current.id ? prev : current;
      }).id;

      newId = highestId + 1;
    }

    const newVehicle = new Vehicle(newId, model, new Date());

    const newVehicleJson = this._vehicleToJsonVehicle.run(newVehicle);

    data.push(newVehicleJson);
    this._fileSystemAdapter.writeData(data, this.filePath);
    return newId;
  }

  public findByIdJson(id: number): JsonVehicle | undefined {
    return this.getByIdJson(id);
  }

  private getByIdJson(id: number): JsonVehicle | undefined {
    const data = this._fileSystemAdapter.readData(this.filePath);

    if (data.length === 0) {
      return undefined;
    }

    const isVehicles = this.isJsonVehicles(data);

    if (!isVehicles) {
      return undefined;
    }

    const foundJsonVehicle = data.find((vehicle) => vehicle.id === id);

    if (foundJsonVehicle === undefined) {
      return undefined;
    }

    return foundJsonVehicle;
  }

  public findById(id: number): Vehicle | undefined {
    const foundJsonVehicle = this.getByIdJson(id);

    if (foundJsonVehicle === undefined) {
      return undefined;
    }

    const vehicle = this._jsonVehicleToVehicle.run(foundJsonVehicle);

    if (vehicle === undefined) {
      return undefined;
    }

    return vehicle;
  }

  public updateModelName(
    id: number,
    modelName: modelTypeNames,
  ): boolean | void {
    const data = this._fileSystemAdapter.readData(this.filePath);

    if (data.length === 0) {
      return false;
    }

    const isVehicles = this.isJsonVehicles(data);

    if (!isVehicles) {
      return false;
    }

    const foundJsonVehicleIdx = data.findIndex((vehicle) => vehicle.id === id);

    if (foundJsonVehicleIdx === -1) {
      return false;
    }

    data[foundJsonVehicleIdx].model.modelName = modelName;

    this._fileSystemAdapter.writeData(data, this.filePath);
  }

  public updateByImei(imei: Imei, model: VehicleModelTypes): boolean {
    const data = this._fileSystemAdapter.readData(this.filePath);

    if (data.length === 0) {
      return false;
    }

    const isVehicles = this.isJsonVehicles(data);

    if (!isVehicles) {
      return false;
    }

    const foundJsonVehicleIdx = data.findIndex((vehicle) => {
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

      return vehicle.model.ioT.network.connectionModules[0].imei === imei;
    });

    if (foundJsonVehicleIdx === -1) {
      return false;
    }

    const vehicleJson = this._vehicleToJsonVehicle.run(
      new Vehicle(
        foundJsonVehicleIdx,
        model,
        data[foundJsonVehicleIdx].createdAt,
      ),
    );

    if (vehicleJson === undefined) {
      return false;
    }

    data[foundJsonVehicleIdx] = vehicleJson;

    this._fileSystemAdapter.writeData(data, this.filePath);

    return true;
  }

  public findByImei(imei: Imei): Vehicle | undefined {
    const data = this._fileSystemAdapter.readData(this.filePath);

    if (data.length === 0) {
      return undefined;
    }

    const isVehicles = this.isJsonVehicles(data);

    if (!isVehicles) {
      return undefined;
    }

    const foundJsonVehicle = data.find((vehicle) => {
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

      return vehicle.model.ioT.network.connectionModules[0].imei === imei;
    });

    if (foundJsonVehicle === undefined) {
      return undefined;
    }

    const vehicle = this._jsonVehicleToVehicle.run(foundJsonVehicle);

    if (vehicle === undefined) {
      return undefined;
    }

    return vehicle;
  }

  public findByImeiJson(imei: Imei): JsonVehicle | undefined {
    const data = this._fileSystemAdapter.readData(this.filePath);

    if (data.length === 0) {
      return undefined;
    }

    const isVehicles = this.isJsonVehicles(data);

    if (!isVehicles) {
      return undefined;
    }

    const foundJsonVehicle = data.find((vehicle) => {
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

      return vehicle.model.ioT.network.connectionModules[0].imei === imei;
    });

    if (foundJsonVehicle === undefined) {
      return undefined;
    }

    return foundJsonVehicle;
  }

  public findAllJson(from: number, to: number): JsonVehicle[] {
    const maxRange = 500;

    if (from > to) {
      return [];
    }

    if (from < 0) {
      return [];
    }

    if (to - from > maxRange) {
      to = from + maxRange;
    }

    const data = this._fileSystemAdapter.readData(this.filePath);

    if (data.length === 0) {
      return [];
    }

    const isVehicles = this.isJsonVehicles(data);

    if (!isVehicles) {
      return [];
    }
    return data.filter((v) => v.id >= from && v.id <= to);
  }

  public findAll(from: number, to: number): Vehicle[] {
    const jsonVehicles = this.findAllJson(from, to);

    const vehicles: Vehicle[] = [];
    jsonVehicles.forEach((jsonVehicle) => {
      const vehicle = this._jsonVehicleToVehicle.run(jsonVehicle);
      if (vehicle === undefined) {
        return;
      }

      vehicles.push(vehicle);
    });

    return vehicles;
  }
}
