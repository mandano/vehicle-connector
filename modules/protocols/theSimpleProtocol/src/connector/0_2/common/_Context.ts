import { Context as PaketsContext } from "../pakets/_Context.ts";

import FromVehicle from "./fromVehicle/_Context.ts";

export class Context {
  private _fromVehicle: FromVehicle | undefined;

  constructor(private _paketsContext: PaketsContext) {}

  get fromVehicle(): FromVehicle {
    if (!this._fromVehicle) {
      this._fromVehicle = new FromVehicle(
        this._paketsContext.simpleUpdate.fromVehicle.buildFromMessageLine,
        this._paketsContext.lock.fromVehicle.createFromMessageLine,
      );
    }
    return this._fromVehicle;
  }
}

export default Context;
