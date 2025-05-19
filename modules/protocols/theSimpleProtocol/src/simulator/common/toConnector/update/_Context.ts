import { Context as v0_1 } from "../../../../simulator/0_1/_Context.ts";
import { Context as v0_2 } from "../../../../simulator/0_2/_Context.ts";

import { CreateMessageLines } from "./CreateMessageLines.ts";

class Context {
  private _createMessageLines: CreateMessageLines | undefined;

  constructor(
    private _v0_1: v0_1,
    private _v0_2: v0_2,
  ) {}

  get createMessageLines(): CreateMessageLines {
    if (!this._createMessageLines) {
      this._createMessageLines = new CreateMessageLines(
        this._v0_1.common.toConnector.update.createMessageLines,
        this._v0_2.common.toConnector.update.createMessageLines,
      );
    }

    return this._createMessageLines;
  }
}

export default Context;
