import { Coordinate } from "./Coordinate.ts";

export class Location {
  private readonly _name: string;
  private readonly _coordinate: Coordinate;

  constructor(name: string, coordinate: Coordinate) {
    this._name = name;
    this._coordinate = coordinate;
  }

  get coordinate(): Coordinate {
    return this._coordinate;
  }

  get name(): string {
    return this._name;
  }
}
