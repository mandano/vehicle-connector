import { Context as v0_1 } from "../../../simulator/0_1/_Context.ts";
import { Context as v0_2 } from "../../../simulator/0_2/_Context.ts";

import UpdateContext from "./update/_Context.ts";
import LockContext from "./lock/_Context.ts";
import CreateAction from "./CreateAction.ts";

class Context {
  private _update: UpdateContext | undefined;
  private _lock: LockContext | undefined;
  private _createAction: CreateAction | undefined;

  constructor(
    private _v0_1: v0_1,
    private _v0_2: v0_2,
  ) {}

  get update(): UpdateContext {
    if (!this._update) {
      this._update = new UpdateContext(this._v0_1, this._v0_2);
    }

    return this._update;
  }

  get lock(): LockContext {
    if (!this._lock) {
      this._lock = new LockContext(this._v0_1, this._v0_2);
    }

    return this._lock;
  }

  get createAction(): CreateAction {
    if (!this._createAction) {
      return new CreateAction(this.lock.createAction);
    }

    return this._createAction;
  }
}

export default Context;
