import CreateSimpleUpdate from "../pakets/simpleUpdate/fromVehicle/CreateSimpleUpdate.ts";
import CreateLock from "../pakets/lock/fromVehicle/CreateLock.ts";

import FromVehicle from "./fromVehicle/_Context.ts";

export class Context {
  private _fromVehicle: FromVehicle | undefined;

  constructor(
    private readonly _createSimpleUpdate: CreateSimpleUpdate,
    private readonly _createLock: CreateLock,
  ) {}

  get fromVehicle(): FromVehicle {
    if (!this._fromVehicle) {
      this._fromVehicle = new FromVehicle(
        this._createSimpleUpdate,
        this._createLock,
      );
    }
    return this._fromVehicle;
  }
}

export default Context;
