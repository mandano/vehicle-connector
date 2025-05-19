import { Context as v0_1Context } from "../../0_1/_Context.ts";
import { Context as v0_2Context } from "../../0_2/_Context.ts";

import { ToModel } from "./ToModel.ts";

class Context {
  private _create: ToModel | undefined;
  constructor(
    private _v0_1: v0_1Context,
    private _v0_2: v0_2Context,
  ) {}

  get create(): ToModel {
    if (!this._create) {
      this._create = new ToModel(
        this._v0_1.pakets.common.toModel,
        this._v0_2.pakets.common.toModel,
      );
    }

    return this._create;
  }
}

export default Context;
