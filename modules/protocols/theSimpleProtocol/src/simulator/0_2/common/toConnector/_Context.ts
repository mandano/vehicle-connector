import UpdateContext from "./update/_Context.ts"

class Context {
  private _update: UpdateContext | undefined;

  get update(): UpdateContext {
    if (!this._update) {
      this._update = new UpdateContext();
    }

    return this._update;
  }
}

export default Context;
