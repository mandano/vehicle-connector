import { Vehicle } from "../../../../../connector/common/src/vehicle/Vehicle.ts";

export interface OnDataInterface {
  run(messageLine: string, vehicle: Vehicle, faultRatio: number): void;
}
