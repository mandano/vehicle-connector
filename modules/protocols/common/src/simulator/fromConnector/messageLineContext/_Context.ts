import TheSimpleProtocolContext from "../../../../../theSimpleProtocol/src/_Context.ts";

import { Create } from "./Create.ts";

class Context {
  private _create: Create | undefined;
  constructor(private readonly _theSimpleProtocol: TheSimpleProtocolContext) {}

  get create(): Create {
    if (!this._create) {
      this._create = new Create(
        this._theSimpleProtocol.simulator.common.fromConnector.createMessageLineContext,
      );
    }

    return this._create;
  }
}

export default Context;
