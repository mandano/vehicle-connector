import { StateJson } from "../../StateJson.ts";

export class JsonPosition {
  public latitude: StateJson<number>;
  public longitude: StateJson<number>;
  public accuracy?: StateJson<number>;
  public createdAt: Date;

  constructor(
    latitude: StateJson<number>,
    longitude: StateJson<number>,
    createdAt: Date,
    accuracy?: StateJson<number>,
  ) {
    this.latitude = latitude;
    this.longitude = longitude;
    this.accuracy = accuracy;
    this.createdAt = createdAt;
  }
}
