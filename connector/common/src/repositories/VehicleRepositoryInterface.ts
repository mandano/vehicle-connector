import { Vehicle } from "../vehicle/Vehicle.ts";
import { Imei } from "../vehicle/components/iot/network/protocol/Imei.ts";
import { JsonVehicle } from "../vehicle/json/JsonVehicle.ts";
import {
  typeNames as modelTypeNames,
  types as modelTypes,
} from "../vehicle/model/models/types.ts";

export default interface VehicleRepositoryInterface {
  findById(id: number): Vehicle | undefined;
  findByIdJson(id: number): JsonVehicle | undefined;
  findByImei(imei: Imei): Vehicle | undefined;
  findByImeiJson(imei: Imei): JsonVehicle | undefined;
  findAll(from: number, to: number): Vehicle[];
  findAllJson(from: number, to: number): JsonVehicle[];
  create(
    model: modelTypes,
  ): number | undefined;
  updateByImei(imei: Imei, model: modelTypes): boolean;
  updateModelName(id: number, modelName: modelTypeNames): boolean | void;
}
