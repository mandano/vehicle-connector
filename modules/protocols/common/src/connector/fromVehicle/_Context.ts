import TheSimpleProtocolContext from "../../../../theSimpleProtocol/src/_Context.ts";

import Create from "./Create.ts";
import CreateByProtocolAndVersion from "./CreateByProtocolAndVersion.ts";
import ModelsContext from "./models/_Context.ts";

class Context {
  private _create: Create | undefined;
  private _createByProtocolAndVersion: CreateByProtocolAndVersion | undefined;
  private _modelsContext: ModelsContext | undefined;

  constructor(private readonly _theSimpleProtocol: TheSimpleProtocolContext) {}

  get create(): Create {
    if (!this._create) {
      this._create = new Create(
        this._theSimpleProtocol.connector.common.fromVehicle.messageLineContext.create,
      );
    }

    return this._create;
  }

  get createByProtocolAndVersion(): CreateByProtocolAndVersion {
    if (!this._createByProtocolAndVersion) {
      this._createByProtocolAndVersion = new CreateByProtocolAndVersion(
        this._theSimpleProtocol.connector.common.fromVehicle.messageLineContext.createByProtocolVersion,
      );
    }

    return this._createByProtocolAndVersion;
  }

  get models(): ModelsContext {
    if (!this._modelsContext) {
      this._modelsContext = new ModelsContext(this._theSimpleProtocol);
    }

    return this._modelsContext;
  }
}

export default Context;
