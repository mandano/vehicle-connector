import LoggerInterface from "../../../../../connector/common/src/logger/LoggerInterface.ts";

import Contextv0_1 from "./0_1/_Context.ts";
import Contextv0_2 from "./0_2/_Context.ts";
import ContextCommon from "./common/_Context.ts";

export class Context {
  private _v0_1: Contextv0_1 | undefined;
  private _v0_2: Contextv0_2 | undefined;
  private _common: ContextCommon | undefined;

  constructor(private _logger: LoggerInterface) {}

  get v0_1(): Contextv0_1 {
    if (!this._v0_1) {
      this._v0_1 = new Contextv0_1(this._logger);
    }

    return this._v0_1;
  }

  get v0_2(): Contextv0_2 {
    if (!this._v0_2) {
      this._v0_2 = new Contextv0_2(this._logger);
    }

    return this._v0_2;
  }

  get common(): ContextCommon {
    if (!this._common) {
      this._common = new ContextCommon(
        this.v0_1,
        this.v0_2,
      );
    }

    return this._common;
  }
}

export default Context;
