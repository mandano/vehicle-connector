import { Context as v0_1 } from "../../../../simulator/0_1/_Context.ts";
import { Context as v0_2 } from "../../../../simulator/0_2/_Context.ts";

import CreateMessageLine from "./CreateMessageLine.ts";
import CreateAction from "./CreateAction.ts";

class Context {
  private _createMessageLine: CreateMessageLine | undefined;

  constructor(
    private _v0_1: v0_1,
    private _v0_2: v0_2,
  ) {}

  get createMessageLine(): CreateMessageLine {
    if (!this._createMessageLine) {
      this._createMessageLine = new CreateMessageLine(
        this._v0_1.pakets.lock.toConnector.lockToMessageLine,
        this._v0_2.pakets.lock.toConnector.lockToMessageLine,
      );
    }

    return this._createMessageLine;
  }

  get createAction(): CreateAction {
    return new CreateAction();
  }
}

export default Context;
