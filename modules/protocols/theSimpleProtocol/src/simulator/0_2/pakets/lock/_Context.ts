import ToConnectorContext from "./toConnector/_Context.ts"

class Context {
  private _toConnectorContext: ToConnectorContext | undefined;

  get toConnector(): ToConnectorContext {
    if (!this._toConnectorContext) {
      this._toConnectorContext = new ToConnectorContext();
    }

    return this._toConnectorContext;
  }
}

export default Context;
