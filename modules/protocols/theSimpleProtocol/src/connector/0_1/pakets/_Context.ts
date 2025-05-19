import LoggerInterface from "../../../../../../../connector/common/src/logger/LoggerInterface.ts";

import ContextLockContext from "./lock/_Context.ts";
import ContextCommon from "./common/_Context.ts";
import ContextSimpleUpdate from "./simpleUpdate/_Context.ts";

export class Context {
  private _lock: ContextLockContext | undefined;
  private _common: ContextCommon | undefined;
  private _simpleUpdate: ContextSimpleUpdate | undefined;

  constructor(private _logger: LoggerInterface) {}

  get lock(): ContextLockContext {
    if (!this._lock) {
      this._lock = new ContextLockContext(this._logger);
    }

    return this._lock;
  }

  get common(): ContextCommon {
    if (!this._common) {
      this._common = new ContextCommon(
        this.simpleUpdate.models.toModel,
        this.lock.models.toModel
      );
    }

    return this._common;
  }

  get simpleUpdate(): ContextSimpleUpdate {
    if (!this._simpleUpdate) {
      this._simpleUpdate = new ContextSimpleUpdate(this._logger);
    }

    return this._simpleUpdate;
  }
}

export default Context;
