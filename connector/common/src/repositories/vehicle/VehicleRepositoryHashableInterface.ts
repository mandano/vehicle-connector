import Vehicle from "../../vehicle/Vehicle.ts";
import Imei from "../../vehicle/components/iot/network/protocol/Imei.ts";
import {
  typeNames as modelTypeNames,
  types as modelTypes,
} from "../../vehicle/model/models/types.ts";
import VehicleDto from "../../vehicle/VehicleDto.ts";
import Hashable from "../../entities/Hashable.ts";
import VehicleStorageObject from "../../vehicle/VehicleStorageObject.ts";

export default interface VehicleRepositoryHashableInterface {
  findById(id: number): Promise<Hashable<Vehicle> | undefined>;
  findByIdDto(id: number): Promise<Hashable<VehicleDto> | undefined>;
  findByImei(imei: Imei): Promise<Hashable<Vehicle> | undefined>;
  findByImeiDto(imei: Imei): Promise<Hashable<VehicleDto> | undefined>;
  findAll(from: number, to: number): Promise<Hashable<Vehicle>[]>;
  findAllDto(from: number, to: number): Promise<Hashable<VehicleDto>[]>;
  create(model: modelTypes): Promise<number | undefined>;
  updateByImei(
    imei: Imei,
    model: modelTypes,
    validationHash: string,
  ): Promise<boolean>;
  updateModelName(
    id: number,
    modelName: modelTypeNames,
    validationHash: string,
  ): Promise<boolean | void>;
  findByIdStorageObject(
    id: number,
  ): Promise<Hashable<VehicleStorageObject> | undefined>;
  findByImeiStorageObject(
    imei: Imei,
  ): Promise<Hashable<VehicleStorageObject> | undefined>;
  findAllStorageObject(
    from: number,
    to: number,
  ): Promise<Hashable<VehicleStorageObject>[]>;
}
