import TheSimpleProtocol from "../../../../../../theSimpleProtocol/src/connector/common/toVehicle/actions/lock/ToMessageLine.ts";
import TheSimpleProtocolContext from "../../../../../../theSimpleProtocol/src/_Context.ts";

import CreateMessageLine from "./CreateMessageLine.ts";

class Context {
  private _createMessageLine: CreateMessageLine | undefined;

  constructor(private readonly _theSimpleProtocol: TheSimpleProtocolContext) {}

  get createMessageLine(): CreateMessageLine {
    if (!this._createMessageLine) {
      this._createMessageLine = new CreateMessageLine(
        new TheSimpleProtocol(
          this._theSimpleProtocol.connector.v0_1.pakets.lock.toVehicle.buildMessageLine,
          this._theSimpleProtocol.connector.v0_2.pakets.lock.toVehicle.createMessageLine,
        ),
      );
    }

    return this._createMessageLine;
  }
}

export default Context;
