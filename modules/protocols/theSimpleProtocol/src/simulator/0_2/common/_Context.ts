import { Context as ConnectorContext} from "../../../connector/_Context.ts";

import FromConnectorContext from "./fromConnector/_Context.ts";
import ToConnectorContext from "./toConnector/_Context.ts";

class Context {
  private _fromConnector: FromConnectorContext | undefined;
  private _toConnector: ToConnectorContext | undefined;

  constructor(private _connectorContext: ConnectorContext) {}

  get fromConnector(): FromConnectorContext {
    if (!this._fromConnector) {
      this._fromConnector = new FromConnectorContext(this._connectorContext);
    }
    return this._fromConnector;
  }

  get toConnector(): ToConnectorContext {
    if (!this._toConnector) {
      this._toConnector = new ToConnectorContext();
    }
    return this._toConnector;
  }
}

export default Context;
