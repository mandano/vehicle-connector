import CreateMessageLine from "./CreateMessageLine.ts";

class Context {
  private _createMessageLine: CreateMessageLine | undefined;

  get createMessageLine(): CreateMessageLine {
    if (!this._createMessageLine) {
      this._createMessageLine = new CreateMessageLine();
    }

    return this._createMessageLine;
  }
}

export default Context;
