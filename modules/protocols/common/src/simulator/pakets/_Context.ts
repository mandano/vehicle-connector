import TheSimpleProtocolContext from "../../../../theSimpleProtocol/src/_Context.ts";

import { Context as LockContext } from "./lock/_Context.ts";

export class Context {
  private _lock: LockContext | undefined;

  constructor(private readonly _theSimpleProtocol: TheSimpleProtocolContext) {}

  get lock(): LockContext {
    if (!this._lock) {
      this._lock = new LockContext(this._theSimpleProtocol);
    }

    return this._lock;
  }
}

export default Context;
