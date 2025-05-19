import LoggerInterface from "../../../../connector/common/src/logger/LoggerInterface.ts";

import ContextConnector from "./connector/_Context.ts";
import ContextSimulator from "./simulator/_Context.ts";

export class Context {
  private _connector: ContextConnector | undefined;
  private _simulator: ContextSimulator | undefined;

  public static readonly PROTOCOL_NAME = "THE_SIMPLE_PROTOCOL";
  public static readonly PROTOCOL_ABBREVIATION = "T_S_P";

  constructor(private readonly _logger: LoggerInterface) {}

  get connector(): ContextConnector {
    if (!this._connector) {
      this._connector = new ContextConnector(this._logger);
    }

    return this._connector;
  }

  get simulator(): ContextSimulator {
    if (!this._simulator) {
      this._simulator = new ContextSimulator(this.connector);
    }

    return this._simulator;
  }
}

export default Context;
