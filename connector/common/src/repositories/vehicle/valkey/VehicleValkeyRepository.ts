import crypto from "crypto";

import ValkeyAdapterInterface from "../../../adapters/valkey/ValkeyAdapterInterface.ts";
import Vehicle from "../../../vehicle/Vehicle.ts";
import type Imei from "../../../vehicle/components/iot/network/protocol/Imei.ts";
import {
  typeNames as modelTypeNames,
  types as modelTypes,
} from "../../../vehicle/model/models/types.ts";
import Hashable from "../../../entities/Hashable.ts";
import LoggerInterface from "../../../logger/LoggerInterface.ts";
import VehicleRepositoryHashableInterface from "../VehicleRepositoryHashableInterface.ts";
import ObjectToDto from "../../../vehicle/dto/objectToDto/ObjectToDto.ts";
import VehicleDto from "../../../vehicle/VehicleDto.ts";
import DtoToVehicle from "../../../vehicle/dto/dtoToVehicle/DtoToVehicle.ts";
import VehicleToObject from "../../../vehicle/dto/vehicleToObject/VehicleToObject.ts";
import IsHashable from "../../../entities/hashable/IsHashable.ts";
import DtoToObject from "../../../vehicle/dto/dtoToObject/DtoToObject.ts";
import VehicleStorageObject from "../../../vehicle/VehicleStorageObject.ts";
import IsVehicleStorageObject from "../../../vehicle/IsVehicleStorageObject.ts";

export default class VehicleValkeyRepository
  implements VehicleRepositoryHashableInterface
{
  constructor(
    private readonly _adapter: ValkeyAdapterInterface,
    private readonly _logger: LoggerInterface,
    private readonly _objectToDto: ObjectToDto,
    private readonly _dtoToVehicle: DtoToVehicle,
    private readonly _vehicleToObject: VehicleToObject,
    private readonly _dtoToObject: DtoToObject,
  ) {}

  async findById(id: number): Promise<Hashable<Vehicle> | undefined> {
    const vehicleDto = await this.findByIdDto(id);
    if (vehicleDto === undefined) {
      return undefined;
    }

    const vehicle = this._dtoToVehicle.run(vehicleDto.value);

    if (vehicle === undefined) {
      return undefined;
    }

    return new Hashable<Vehicle>(vehicleDto.hash, vehicle);
  }

  async findByIdStorageObject(
    id: number,
  ): Promise<Hashable<VehicleStorageObject> | undefined> {
    const vehicleDto = await this.findByIdDto(id);
    if (vehicleDto === undefined) {
      return undefined;
    }

    const vehicle = this._dtoToObject.run(vehicleDto.value);

    if (vehicle === undefined) {
      return undefined;
    }

    return new Hashable<VehicleStorageObject>(vehicleDto.hash, vehicle);
  }

  // TODO: move to dedicated dto repo
  async findByIdDto(id: number): Promise<Hashable<VehicleDto> | undefined> {
    const hashableCandidate = await this._adapter.get(`vehicle:${id}`);

    if (
      hashableCandidate === undefined ||
      !IsHashable.run(hashableCandidate) ||
      typeof hashableCandidate.value !== "object" ||
      hashableCandidate.value === null
    ) {
      return undefined;
    }

    if (!IsVehicleStorageObject.run(hashableCandidate.value)) {
      return undefined;
    }

    const hashable = new Hashable<VehicleStorageObject>(
      hashableCandidate.hash,
      hashableCandidate.value,
    );

    const dto = this._objectToDto.run(hashable.value);

    if (dto === undefined) {
      return undefined;
    }

    return new Hashable<VehicleDto>(hashableCandidate.hash, dto);
  }

  async findByImei(imei: Imei): Promise<Hashable<Vehicle> | undefined> {
    const id = await this._adapter.get(`vehicle:imei:${imei}`);
    if (!id) return undefined;
    return await this.findById(Number(id));
  }

  async findByImeiStorageObject(
    imei: Imei,
  ): Promise<Hashable<VehicleStorageObject> | undefined> {
    const id = await this._adapter.get(`vehicle:imei:${imei}`);
    if (!id) return undefined;

    const vehicleDto = await this.findByIdDto(Number(id));
    if (vehicleDto === undefined) {
      return undefined;
    }

    const vehicle = this._dtoToObject.run(vehicleDto.value);

    if (vehicle === undefined) {
      return undefined;
    }

    return new Hashable<VehicleStorageObject>(vehicleDto.hash, vehicle);
  }

  async findByImeiDto(imei: Imei): Promise<Hashable<VehicleDto> | undefined> {
    const id = await this._adapter.get(`vehicle:imei:${imei}`);
    if (!id) return undefined;
    return await this.findByIdDto(Number(id));
  }

  async findAll(from: number, to: number): Promise<Hashable<Vehicle>[]> {
    const keys = await this._adapter.scan("vehicle:[0-9]*");
    const ids = keys
      .map((k) => Number(k.split(":")[1]))
      .filter((id) => id >= from && id <= to);
    const vehicles = await Promise.all(ids.map((id) => this.findById(id)));
    return vehicles.filter((vehicle) => vehicle !== undefined);
  }

  async findAllDto(from: number, to: number): Promise<Hashable<VehicleDto>[]> {
    const keys = await this._adapter.scan("vehicle:[0-9]*");
    const ids = keys
      .map((k) => Number(k.split(":")[1]))
      .filter((id) => id >= from && id <= to);
    const vehicles = await Promise.all(ids.map((id) => this.findByIdDto(id)));
    return vehicles.filter((vehicle) => vehicle !== undefined);
  }

  async findAllStorageObject(
    from: number,
    to: number,
  ): Promise<Hashable<VehicleStorageObject>[]> {
    const keys = await this._adapter.scan("vehicle:[0-9]*");
    const ids = keys
      .map((k) => Number(k.split(":")[1]))
      .filter((id) => id >= from && id <= to);
    const vehicles = await Promise.all(ids.map((id) => this.findByIdDto(id)));
    const vehiclesDtos = vehicles.filter((vehicle) => vehicle !== undefined);

    const storageObjects: Hashable<VehicleStorageObject>[] = [];
    for (const vehicleDto of vehiclesDtos) {
      const hashable = new Hashable<VehicleStorageObject>(
        vehicleDto.hash,
        this._dtoToObject.run(vehicleDto.value),
      );
      storageObjects.push(hashable);
    }
    return storageObjects;
  }

  public async create(model: modelTypes): Promise<number | undefined> {
    const keys = await this._adapter.scan("vehicle:[0-9]*");
    const ids = keys.map((k) => Number(k.split(":")[1]));
    const newId = ids.length > 0 ? Math.max(...ids) + 1 : 1;
    const imeis = this.getImeis(model);

    const imeisKeyValues = imeis.map((imei) => ({
      key: `vehicle:imei:${imei}`,
      value: newId,
    }));

    const newVehicle = new Vehicle(newId, model, new Date());
    const vehicleForStorage = this._vehicleToObject.run(newVehicle);

    if (vehicleForStorage === undefined) {
      return undefined;
    }

    const hashVehicleForStorage = crypto
      .createHash("sha256")
      .update(JSON.stringify(vehicleForStorage))
      .digest("hex");

    const toBeStored = new Hashable<object>(
      hashVehicleForStorage,
      vehicleForStorage,
    );

    const multiSetData = [
      {
        key: `vehicle:${newId}`,
        value: {
          hash: toBeStored.hash,
          value: toBeStored.value,
        },
      },
      ...imeisKeyValues,
    ];
    await this._adapter.multiSet(multiSetData);

    return newId;
  }

  private getImeis(model: modelTypes): Imei[] {
    const network = model.ioT?.network;

    if (!network) return [];

    const connectionModules = network.connectionModules;

    if (connectionModules.length === 0) return [];

    const imeis: Imei[] = [];

    for (const connectionModule of connectionModules) {
      if (connectionModule.imei) {
        imeis.push(connectionModule.imei);
      }
    }

    return imeis;
  }

  async updateByImei(
    imei: Imei,
    model: modelTypes,
    validationHash: string,
  ): Promise<boolean> {
    const id = await this._adapter.get(`vehicle:imei:${imei}`);
    if (!id) return false;
    const key = `vehicle:${id}`;

    const hashableCandidate = await this.findByIdDto(Number(id));

    if (hashableCandidate === undefined) {
      return false;
    }

    if (hashableCandidate.hash !== validationHash) {
      this._logger.warn(
        `Hash mismatch for vehicle with IMEI ${imei}. Expected: ${validationHash}, Found: ${hashableCandidate.hash}`,
      );

      return false;
    }

    const vehicle = new Vehicle(
      hashableCandidate.value.id,
      model,
      new Date(hashableCandidate.value.createdAt),
    );

    const vehicleForStorage = this._vehicleToObject.run(vehicle);

    if (vehicleForStorage === undefined) {
      return false;
    }

    const hashVehicleForStorage = crypto
      .createHash("sha256")
      .update(JSON.stringify(vehicleForStorage))
      .digest("hex");

    const toStorage = new Hashable(hashVehicleForStorage, vehicleForStorage);

    return await this._adapter.set(key, {
      hash: toStorage.hash,
      value: toStorage.value,
    });
  }

  async updateModelName(
    id: number,
    modelName: modelTypeNames,
    validationHash: string,
  ): Promise<boolean | void> {
    const key = `vehicle:${id}`;

    const hashableCandidate = await this.findByIdDto(Number(id));

    if (hashableCandidate === undefined) {
      return false;
    }

    if (!IsHashable.run(hashableCandidate)) {
      return false;
    }

    const fromStorage = new Hashable(
      hashableCandidate.hash,
      hashableCandidate.value,
    );

    if (hashableCandidate.hash !== validationHash) {
      this._logger.warn(
        `Hash mismatch for vehicle with id ${id}. Expected: ${validationHash}, Found: ${fromStorage.hash}`,
      );

      return false;
    }

    const vehicleToStorage = this._dtoToObject.run(fromStorage.value);

    vehicleToStorage.model.modelName = modelName;

    const hashVehicleToStorage = crypto
      .createHash("sha256")
      .update(JSON.stringify(vehicleToStorage))
      .digest("hex");

    const toStorage = new Hashable(hashVehicleToStorage, vehicleToStorage);

    return await this._adapter.set(key, {
      hash: toStorage.hash,
      value: toStorage.value,
    });
  }
}
