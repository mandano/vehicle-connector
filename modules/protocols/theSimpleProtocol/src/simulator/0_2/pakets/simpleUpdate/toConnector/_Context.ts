import CreateMessageLine from "./CreateMessageLine.ts";

export default class Context {
  private _createMessageLine: CreateMessageLine | undefined;

  get createMessageLine(): CreateMessageLine {
    if (!this._createMessageLine) {
      this._createMessageLine = new CreateMessageLine();
    }

    return this._createMessageLine;
  }
}