import { Context as v0_1 } from "../../simulator/0_1/_Context.ts";
import { Context as v0_2 } from "../../simulator/0_2/_Context.ts";

import ToConnector from "./toConnector/_Context.ts";
import FromConnector from "./fromConnector/_Context.ts";

export class Context {
  private _toConnector: ToConnector | undefined;
  private _fromConnector: FromConnector | undefined;

  constructor(
    private _v0_1: v0_1,
    private _v0_2: v0_2,
  ) {}

  get toConnector(): ToConnector {
    if (!this._toConnector) {
      this._toConnector = new ToConnector(this._v0_1, this._v0_2);
    }

    return this._toConnector;
  }

  get fromConnector(): FromConnector {
    if (!this._fromConnector) {
      this._fromConnector = new FromConnector(this._v0_1, this._v0_2);
    }

    return this._fromConnector;
  }
}
