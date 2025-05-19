import TheSimpleProtocolContext from "../../theSimpleProtocol/src/_Context.ts";

import { Context as SimulatorContext } from "./simulator/_Context.ts";
import ConnectorContext from "./connector/_Context.ts";

export class Context {
  private _simulator: SimulatorContext | undefined;
  private _connector: ConnectorContext | undefined;

  constructor(private readonly _theSimpleProtocol: TheSimpleProtocolContext) {}

  get simulator(): SimulatorContext {
    if (!this._simulator) {
      this._simulator = new SimulatorContext(this._theSimpleProtocol);
    }

    return this._simulator;
  }

  get connector(): ConnectorContext {
    if (!this._connector) {
      this._connector = new ConnectorContext(this._theSimpleProtocol);
    }

    return this._connector;
  }
}

export default Context;
