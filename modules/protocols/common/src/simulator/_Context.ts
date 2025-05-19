import TheSimpleProtocolContext from "../../../theSimpleProtocol/src/_Context.ts";

import PaketsContext from "./pakets/_Context.ts";
import FromConnectorContext from "./fromConnector/_Context.ts";
import ToConnectorContext from "./toConnector/_Context.ts";

export class Context {
  private _pakets: PaketsContext | undefined;
  private _fromConnector: FromConnectorContext | undefined;
  private _toConnector: ToConnectorContext | undefined;

  constructor(private readonly _theSimpleProtocol: TheSimpleProtocolContext) {}

  get pakets(): PaketsContext {
    if (!this._pakets) {
      this._pakets = new PaketsContext(this._theSimpleProtocol);
    }

    return this._pakets;
  }

  get fromConnector(): FromConnectorContext {
    if (!this._fromConnector) {
      this._fromConnector = new FromConnectorContext(this._theSimpleProtocol);
    }

    return this._fromConnector;
  }

  get toConnector(): ToConnectorContext {
    if (!this._toConnector) {
      this._toConnector = new ToConnectorContext(this._theSimpleProtocol);
    }

    return this._toConnector;
  }
}

export default Context;
