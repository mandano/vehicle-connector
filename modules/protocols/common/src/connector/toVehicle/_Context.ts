import TheSimpleProtocolContext from "../../../../theSimpleProtocol/src/_Context.ts";

import ActionsContext from "./actions/_Context.ts";

class Context {
  private _actions: ActionsContext | undefined;

  constructor(private readonly _theSimpleProtocol: TheSimpleProtocolContext) {}

  get actions(): ActionsContext {
    if (!this._actions) {
      this._actions = new ActionsContext(this._theSimpleProtocol);
    }

    return this._actions;
  }
}

export default Context;
