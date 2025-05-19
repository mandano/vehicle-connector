import Pakets from "../../pakets/_Context.ts";

import UpdateContext from "./update/_Context.ts";

class Context {
  private _updateContext: UpdateContext | undefined;

  constructor(private _pakets: Pakets) {}

  get update(): UpdateContext {
    if (!this._updateContext) {
      this._updateContext = new UpdateContext(this._pakets.simpleUpdate);
    }

    return this._updateContext;
  }
}

export default Context;
