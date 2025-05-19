import SimpleUpdateContext from "../../../pakets/simpleUpdate/_Context.ts";

import ToMessageLines from "./ToMessageLines.ts";

class Context {
  private _createMessageLines: ToMessageLines | undefined;

  constructor(private _simpleUpdateContext: SimpleUpdateContext) {}

  get createMessageLines(): ToMessageLines {
    if (!this._createMessageLines) {
      this._createMessageLines = new ToMessageLines(
        this._simpleUpdateContext.models.createMessageLine,
      );
    }

    return this._createMessageLines;
  }
}

export default Context;
