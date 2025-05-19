import LoggerInterface from "../../../../../../../../connector/common/src/logger/LoggerInterface.ts";

import ContextModels from "./models/_Context.ts";
import ContextFromVehicle from "./fromVehicle/_Context.ts";

export class Context {
  private _models: ContextModels | undefined;
  private _fromVehicle: ContextFromVehicle | undefined;

  constructor(private readonly _logger: LoggerInterface) {}

  get models(): ContextModels {
    if (!this._models) {
      this._models = new ContextModels();
    }

    return this._models;
  }

  get fromVehicle(): ContextFromVehicle {
    if (!this._fromVehicle) {
      this._fromVehicle = new ContextFromVehicle(this._logger);
    }

    return this._fromVehicle;
  }
}

export default Context;