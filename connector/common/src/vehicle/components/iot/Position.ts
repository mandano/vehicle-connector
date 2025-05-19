import { State } from "../../State.ts";

export class Position {
  private _latitude: State<number>;
  private _longitude: State<number>;
  private _accuracy?: State<number>;
  private readonly _createdAt: Date;

  constructor(
    latitude: State<number>,
    longitude: State<number>,
    createdAt: Date,
    accuracy?: State<number>,
  ) {
    this._latitude = latitude;
    this._longitude = longitude;
    this._accuracy = accuracy;
    this._createdAt = createdAt;
  }

  get latitude(): State<number> {
    return this._latitude;
  }

  get longitude(): State<number> {
    return this._longitude;
  }

  get accuracy(): State<number> | undefined {
    return this._accuracy;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  set latitude(latitude: State<number>) {
    this._latitude = latitude;
  }

  set longitude(longitude: State<number>) {
    this._longitude = longitude;
  }

  set accuracy(accuracy: State<number> | undefined) {
    this._accuracy = accuracy;
  }
}
