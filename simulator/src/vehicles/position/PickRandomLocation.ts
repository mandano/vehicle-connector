import { Location } from "./Location.ts";

export class PickRandomLocation {
  constructor(private readonly _locations: Location[]) {}

  public run(): Location {
    const randomIndex = Math.floor(Math.random() * this._locations.length);
    return this._locations[randomIndex];
  }
}
