import LoggerInterface from "../../../../../../../../connector/common/src/logger/LoggerInterface.ts";

import ContextFromVehicle from "./fromVehicle/_Context.ts";
import ContextToVehicle from "./toVehicle/_Context.ts";
import ContextModels from "./models/_Context.ts";

export class Context {
  private _fromVehicle: ContextFromVehicle | undefined;
  private _toVehicle: ContextToVehicle | undefined;
  private _models: ContextModels | undefined;

  constructor(private _logger: LoggerInterface) {}

  get fromVehicle(): ContextFromVehicle {
    if (!this._fromVehicle) {
      this._fromVehicle = new ContextFromVehicle(this._logger);
    }
    return this._fromVehicle;
  }

  get toVehicle(): ContextToVehicle {
    if (!this._toVehicle) {
      this._toVehicle = new ContextToVehicle();
    }

    return this._toVehicle;
  }

  get models(): ContextModels {
    if (!this._models) {
      this._models = new ContextModels();
    }

    return this._models;
  }
}

export default Context;