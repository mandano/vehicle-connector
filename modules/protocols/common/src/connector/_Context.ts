import TheSimpleProtocolContext from "../../../theSimpleProtocol/src/_Context.ts";

import ToVehicle from "./toVehicle/_Context.ts";
import FromVehicle from "./fromVehicle/_Context.ts";

class Context {
  private _toVehicle: ToVehicle | undefined;
  private _fromVehicle: FromVehicle | undefined;

  constructor(private readonly _theSimpleProtocol: TheSimpleProtocolContext) {}

  get toVehicle(): ToVehicle {
    if (!this._toVehicle) {
      this._toVehicle = new ToVehicle(this._theSimpleProtocol);
    }

    return this._toVehicle;
  }

  get fromVehicle(): FromVehicle {
    if (!this._fromVehicle) {
      this._fromVehicle = new FromVehicle(this._theSimpleProtocol);
    }

    return this._fromVehicle;
  }
}

export default Context;
