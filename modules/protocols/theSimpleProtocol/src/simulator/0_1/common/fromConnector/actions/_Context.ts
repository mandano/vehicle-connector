import { Context as ConnectorContext } from "../../../../../connector/_Context.ts";

import { CreateMessageLineContext } from "./CreateMessageLineContext.ts";
import { CreatePaket } from "./CreatePaket.ts";

class Context {
  private _createMessageLineContext: CreateMessageLineContext | undefined;
  private _createPaket: CreatePaket | undefined;

  constructor(private _connectorContext: ConnectorContext) {}

  get createMessageLineContext(): CreateMessageLineContext {
    if (!this._createMessageLineContext) {
      this._createMessageLineContext = new CreateMessageLineContext(
        this.createPaket,
      );
    }

    return this._createMessageLineContext;
  }

  get createPaket(): CreatePaket {
    if (!this._createPaket) {
      this._createPaket = new CreatePaket(
        this._connectorContext.v0_1.pakets.lock.fromVehicle.createLock,
      );
    }

    return this._createPaket;
  }
}

export default Context;
