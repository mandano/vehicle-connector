import LockableScooter from "./lockableScooter/_Context.ts";
import CreateMessageLine from "./CreateMessageLine.ts";

class Context {
  private _lockableScooter: LockableScooter | undefined;
  private _createMessageLine: CreateMessageLine | undefined;

  get lockableScooter(): LockableScooter {
    if (!this._lockableScooter) {
      this._lockableScooter = new LockableScooter();
    }
    return this._lockableScooter;
  }

  get createMessageLine(): CreateMessageLine {
    if (!this._createMessageLine) {
      this._createMessageLine = new CreateMessageLine(
        this.lockableScooter.createMessageLine,
      );
    }
    return this._createMessageLine;
  }
}

export default Context;
