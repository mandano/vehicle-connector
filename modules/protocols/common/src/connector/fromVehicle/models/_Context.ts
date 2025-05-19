import TheSimpleProtocolContext from "../../../../../theSimpleProtocol/src/_Context.ts";

import CreateByMessageLineContext from "./CreateByMessageLineContext.ts";

class Context {
  private _createByMessageLineContext: CreateByMessageLineContext | undefined;

  constructor(private readonly _theSimpleProtocol: TheSimpleProtocolContext) {}

  get createByMessageLineContext(): CreateByMessageLineContext {
    if (!this._createByMessageLineContext) {
      this._createByMessageLineContext = new CreateByMessageLineContext(
        this._theSimpleProtocol.connector.common.models.create,
      );
    }

    return this._createByMessageLineContext;
  }
}

export default Context;
