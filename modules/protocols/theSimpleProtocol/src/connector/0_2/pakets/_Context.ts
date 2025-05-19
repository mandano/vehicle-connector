import LoggerInterface from "../../../../../../../connector/common/src/logger/LoggerInterface.ts";

import LockContext from "./lock/_Context.ts";
import ContextSimpleUpdate from "./simpleUpdate/_Context.ts";
import ContextCommon from "./common/_Context.ts";

export class Context {
  private _lock: LockContext | undefined;
  private _simpleUpdate: ContextSimpleUpdate | undefined;
  private _common: ContextCommon | undefined;

  constructor(private _logger: LoggerInterface) {}

  get lock(): LockContext {
    if (!this._lock) {
      this._lock = new LockContext(this._logger);
    }

    return this._lock;
  }

  get simpleUpdate(): ContextSimpleUpdate {
    if (!this._simpleUpdate) {
      this._simpleUpdate = new ContextSimpleUpdate(this._logger);
    }

    return this._simpleUpdate;
  }

  get common(): ContextCommon {
    if (!this._common) {
      this._common = new ContextCommon(
        this.simpleUpdate.models.toModel,
        this.lock.models.toModel,
      );
    }

    return this._common;
  }
}

export default Context;