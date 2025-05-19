import { Context as v0_1Context } from "../../../0_1/_Context.ts";
import { Context as v0_2Context } from "../../../0_2/_Context.ts";

import { Create } from "./Create.ts";
import { CreateByProtocolVersion } from "./CreateByProtocolVersion.ts";

export class Context {
  private _create: Create | undefined;
  private _createByProtocolVersion: CreateByProtocolVersion | undefined;

  constructor(
    private _v0_1Context: v0_1Context,
    private _v0_2Context: v0_2Context,
  ) {}

  get create(): Create {
    if (!this._create) {
      this._create = new Create(
        this._v0_1Context.common.fromVehicle.createMessageLineContext,
        this._v0_2Context.common.fromVehicle.createMessageLineContext,
      );
    }

    return this._create;
  }

  get createByProtocolVersion(): CreateByProtocolVersion {
    if (!this._createByProtocolVersion) {
      this._createByProtocolVersion = new CreateByProtocolVersion(
        this._v0_1Context.common.fromVehicle.createMessageLineContext,
        this._v0_2Context.common.fromVehicle.createMessageLineContext,
      );
    }

    return this._createByProtocolVersion;
  }
}

export default Context;