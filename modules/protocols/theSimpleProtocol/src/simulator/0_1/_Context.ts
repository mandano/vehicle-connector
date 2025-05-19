import { Context as ConnectorContext } from "../../connector/_Context.ts";

import PaketsContext from "./pakets/_Context.ts";
import CommonContext from "./common/_Context.ts";

export class Context {
  private _paketsContext: PaketsContext | undefined;
  private _commonContext: CommonContext | undefined;

  constructor(
    private readonly _connector: ConnectorContext,
  ) {}

  get pakets(): PaketsContext {
    if (!this._paketsContext) {
      this._paketsContext = new PaketsContext();
    }

    return this._paketsContext;
  }

  get common(): CommonContext {
    if (!this._commonContext) {
      this._commonContext = new CommonContext(this.pakets, this._connector);
    }

    return this._commonContext;
  }
}

export default Context;
