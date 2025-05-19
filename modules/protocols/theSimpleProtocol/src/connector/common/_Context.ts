import { Context as v0_1Context } from "../0_1/_Context.ts";
import { Context as v0_2Context } from "../0_2/_Context.ts";

import FromVehicleContext from "./fromVehicle/_Context.ts";
import ModelsContext from "./models/_Context.ts";

class Context {
  private _fromVehicle: FromVehicleContext | undefined;
  private _modelsContext: ModelsContext | undefined;

  constructor(
    private _v0_1Context: v0_1Context,
    private _v0_2Context: v0_2Context,
  ) {}

  get fromVehicle(): FromVehicleContext {
    if (!this._fromVehicle) {
      this._fromVehicle = new FromVehicleContext(
        this._v0_1Context,
        this._v0_2Context,
      );
    }

    return this._fromVehicle;
  }

  get models(): ModelsContext {
    if (!this._modelsContext) {
      this._modelsContext = new ModelsContext(this._v0_1Context, this._v0_2Context);
    }

    return this._modelsContext;
  }
}

export default Context;
