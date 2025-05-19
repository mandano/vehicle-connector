import CreateMessageLine from "./CreateMessageLine.ts";
import { LockToMessageLine } from "./LockToMessageLine.ts";

export class Context {
  private _createMessageLine: CreateMessageLine | undefined;
  private _lockToMessageLine: LockToMessageLine | undefined;

  get createMessageLine(): CreateMessageLine {
    if (!this._createMessageLine) {
      this._createMessageLine = new CreateMessageLine();
    }
    return this._createMessageLine;
  }

  get lockToMessageLine(): LockToMessageLine {
    if (!this._lockToMessageLine) {
      this._lockToMessageLine = new LockToMessageLine(this.createMessageLine);
    }
    return this._lockToMessageLine;
  }
}

export default Context;
