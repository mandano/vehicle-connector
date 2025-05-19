import ContextSimpleUpdate from "../../../pakets/simpleUpdate/_Context.ts";

import CreateMessageLines from "./CreateMessageLines.ts";

class Context {
  private _simpleUpdate: ContextSimpleUpdate | undefined;
  private _createMessageLines: CreateMessageLines | undefined;

  get updateSimpleScooter(): ContextSimpleUpdate {
    if (!this._simpleUpdate) {
      this._simpleUpdate = new ContextSimpleUpdate();
    }

    return this._simpleUpdate;
  }

  get createMessageLines(): CreateMessageLines {
    if (!this._createMessageLines) {
      this._createMessageLines = new CreateMessageLines(
        this.updateSimpleScooter.createMessageLine,
      );
    }

    return this._createMessageLines;
  }
}

export default Context;
