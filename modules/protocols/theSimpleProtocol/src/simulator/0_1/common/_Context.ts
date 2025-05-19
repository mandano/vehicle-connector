import Pakets from "../pakets/_Context.ts";
import { Context as ConnectorContext } from "../../../connector/_Context.ts";

import ToConnector from "./toConnector/_Context.ts";
import FromConnector from "./fromConnector/_Context.ts";

class Context {
  private _fromConnector: ToConnector | undefined;
  private _toConnector: FromConnector | undefined;

  constructor(
    private _pakets: Pakets,
    private _connectorContext: ConnectorContext,
  ) {}

  get toConnector(): ToConnector {
    if (!this._fromConnector) {
      this._fromConnector = new ToConnector(this._pakets);
    }

    return this._fromConnector;
  }

  get fromConnector(): FromConnector {
    if (!this._toConnector) {
      this._toConnector = new FromConnector(this._connectorContext);
    }

    return this._toConnector;
  }
}

export default Context;
