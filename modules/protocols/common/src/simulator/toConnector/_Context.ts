import TheSimpleProtocolContext from "../../../../theSimpleProtocol/src/_Context.ts";

import UpdateContext from "./update/_Context.ts";

class Context {
  private _update: UpdateContext | undefined;

  constructor(private readonly _theSimpleProtocol: TheSimpleProtocolContext) {}

  get update(): UpdateContext {
    if (!this._update) {
      this._update = new UpdateContext(this._theSimpleProtocol);
    }

    return this._update;
  }
}

export default Context;
