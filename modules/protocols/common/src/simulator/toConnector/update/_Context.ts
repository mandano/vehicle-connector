import TheSimpleProtocolContext from "../../../../../theSimpleProtocol/src/_Context.ts";

import { CreateMessageLines } from "./CreateMessageLines.ts";
import ActionContext from "./action/_Context.ts";

class Context {
  private _createMessageLines: CreateMessageLines | undefined;
  private _action: ActionContext | undefined;

  constructor(private readonly _theSimpleProtocol: TheSimpleProtocolContext) {}

  get createMessageLines(): CreateMessageLines {
    if (!this._createMessageLines) {
      this._createMessageLines = new CreateMessageLines(
        this._theSimpleProtocol.simulator.common.toConnector.update.createMessageLines,
      );
    }

    return this._createMessageLines;
  }

  get action(): ActionContext {
    if (!this._action) {
      this._action = new ActionContext(this._theSimpleProtocol);
    }

    return this._action;
  }
}

export default Context;
