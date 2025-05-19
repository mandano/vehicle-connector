import SimpleUpdateContext from './simpleUpdate/_Context.ts';
import LockContext from "./lock/_Context.ts";

export class Context {
  private _simpleUpdateContext: SimpleUpdateContext | undefined;
  private _lockContext: LockContext | undefined;

  get simpleUpdate(): SimpleUpdateContext {
    if (!this._simpleUpdateContext) {
      this._simpleUpdateContext = new SimpleUpdateContext();
    }
    return this._simpleUpdateContext;
  }

  get lock(): LockContext {
    if (!this._lockContext) {
      this._lockContext = new LockContext();
    }
    return this._lockContext;
  }
}

export default Context;
