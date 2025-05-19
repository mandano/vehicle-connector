import { types as modelTypes } from "./model/models/types.ts";

export class Vehicle {
  private readonly _id: number;
  private readonly _model: modelTypes;
  private readonly _createdAt: Date;

  constructor(id: number, model: modelTypes, createdAt: Date) {
    this._id = id;
    this._model = model;
    this._createdAt = createdAt;
  }

  get id(): number {
    return this._id;
  }

  get model(): modelTypes {
    return this._model;
  }

  get createdAt(): Date {
    return this._createdAt;
  }
}

export default Vehicle;
