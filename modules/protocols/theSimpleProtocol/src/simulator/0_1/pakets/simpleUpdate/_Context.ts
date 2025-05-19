import ModelsContext from "./models/_Context.ts"
import ToConnectorContext from "./toConnector/_Context.ts"

class Context {
  private _modelsContext: ModelsContext | undefined;
  private _toConnectorContext: ToConnectorContext | undefined;

  get models(): ModelsContext {
    if (!this._modelsContext) {
      this._modelsContext = new ModelsContext();
    }
    return this._modelsContext;
  }

  get toConnector(): ToConnectorContext {
    if (!this._toConnectorContext) {
      this._toConnectorContext = new ToConnectorContext();
    }
    return this._toConnectorContext;
  }
}

export default Context;