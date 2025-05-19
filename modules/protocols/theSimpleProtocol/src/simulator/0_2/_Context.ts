import { Context as ConnectorContext } from "../../connector/_Context.ts";

import CommonContext from "./common/_Context.ts";
import PaketsContext from "./pakets/_Context.ts";

export class Context {
  private _commonContext: CommonContext | undefined;
  private _paketsContext: PaketsContext | undefined;

  constructor(private readonly _connectorContext: ConnectorContext) {}

  get common(): CommonContext {
    if (!this._commonContext) {
      this._commonContext = new CommonContext(this._connectorContext);
    }

    return this._commonContext;
  }

  get pakets(): PaketsContext {
    if (!this._paketsContext) {
      this._paketsContext = new PaketsContext();
    }

    return this._paketsContext;
  }
}

export default Context;
