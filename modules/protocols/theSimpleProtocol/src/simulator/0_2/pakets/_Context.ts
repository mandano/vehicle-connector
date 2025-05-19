import LockContext from "./lock/_Context.ts";

class Context {
  private _lockContext: LockContext | undefined;

  get lock(): LockContext {
    if (!this._lockContext) {
      this._lockContext = new LockContext();
    }

    return this._lockContext;
  }
}

export default Context;
