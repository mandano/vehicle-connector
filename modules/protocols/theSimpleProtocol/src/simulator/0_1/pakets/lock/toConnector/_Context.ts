import { BuildMessageLine} from "./BuildMessageLine.ts";
import { LockToMessageLine } from "./LockToMessageLine.ts";

export class Context {
  private _buildMessageLine: BuildMessageLine | undefined;
  private _lockToMessageLine: LockToMessageLine | undefined;

  get buildMessageLine(): BuildMessageLine {
    if (!this._buildMessageLine) {
      this._buildMessageLine = new BuildMessageLine();
    }
    return this._buildMessageLine;
  }

  get lockToMessageLine(): LockToMessageLine {
    if (!this._lockToMessageLine) {
      this._lockToMessageLine = new LockToMessageLine(this.buildMessageLine);
    }
    return this._lockToMessageLine;
  }
}

export default Context;