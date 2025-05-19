import { Context as ConnectorContext } from "../connector/_Context.ts";

import { Context as v0_1Context } from "./0_1/_Context.ts";
import { Context as v0_2Context } from "./0_2/_Context.ts";
import { Context as CommonContext } from "./common/_Context.ts";

export class Context {
  private _v0_1Context: v0_1Context | undefined;
  private _v0_2Context: v0_2Context | undefined;
  private _commonContext: CommonContext | undefined;

  constructor(private _connectorContext: ConnectorContext) {}

  get v0_1(): v0_1Context {
    if (!this._v0_1Context) {
      this._v0_1Context = new v0_1Context(this._connectorContext);
    }

    return this._v0_1Context;
  }

  get v0_2(): v0_2Context {
    if (!this._v0_2Context) {
      this._v0_2Context = new v0_2Context(this._connectorContext);
    }

    return this._v0_2Context;
  }

  get common(): CommonContext {
    if (!this._commonContext) {
      this._commonContext = new CommonContext(
        this.v0_1,
        this.v0_2,
      );
    }

    return this._commonContext;
  }
}

export default Context;
