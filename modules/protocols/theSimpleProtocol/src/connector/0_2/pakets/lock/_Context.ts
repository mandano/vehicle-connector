import { LoggerInterface } from "../../../../../../../../connector/common/src/logger/LoggerInterface.ts";

import ToVehicleContext from "./toVehicle/_Context.ts";
import FromVehicleContext from "./fromVehicle/_Context.ts";
import ModelsContext from "./models/_Context.ts";

class Context {
  private _toVehicleContext: ToVehicleContext | undefined;
  private _fromVehicleContext: FromVehicleContext | undefined;
  private _modelsContext: ModelsContext | undefined;

  constructor(private readonly _logger: LoggerInterface) {}

  get toVehicle(): ToVehicleContext {
    if (!this._toVehicleContext) {
      this._toVehicleContext = new ToVehicleContext();
    }

    return this._toVehicleContext;
  }

  get fromVehicle(): FromVehicleContext {
    if (!this._fromVehicleContext) {
      this._fromVehicleContext = new FromVehicleContext(this._logger);
    }

    return this._fromVehicleContext;
  }

  get models(): ModelsContext {
    if (!this._modelsContext) {
      this._modelsContext = new ModelsContext();
    }

    return this._modelsContext;
  }
}

export default Context;
