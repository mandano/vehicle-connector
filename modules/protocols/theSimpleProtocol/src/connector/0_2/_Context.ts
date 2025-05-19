import LoggerInterface from "../../../../../../connector/common/src/logger/LoggerInterface.ts";

import ContextPakets from "./pakets/_Context.ts";
import ContextCommon from "./common/_Context.ts";

export class Context {
  public static readonly VERSION = "0_2";

  private _pakets: ContextPakets | undefined;
  private _common: ContextCommon | undefined;

  constructor(private _logger: LoggerInterface) {}

  get pakets(): ContextPakets {
    if (!this._pakets) {
      this._pakets = new ContextPakets(this._logger);
    }

    return this._pakets;
  }

  get common(): ContextCommon {
    if (!this._common) {
      this._common = new ContextCommon(this.pakets);
    }

    return this._common;
  }
}

export default Context;
