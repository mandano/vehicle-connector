import {JsonVehicleModel} from "./JsonVehicleModel.ts";

export class JsonVehicle {
  id: number;
  model: JsonVehicleModel;
  createdAt: Date;

  constructor(
    id: number,
    model: JsonVehicleModel,
    createdAt: Date,
  ) {
    this.id = id;
    this.model = model;
    this.createdAt = createdAt;
  }
}
