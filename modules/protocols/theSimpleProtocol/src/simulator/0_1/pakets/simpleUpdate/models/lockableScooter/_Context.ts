import { CreateSimpleUpdate } from "../../../../../../connector/0_1/pakets/simpleUpdate/CreateSimpleUpdate.ts";
import CreateMessageLineFromSimpleUpdate from "../../toConnector/CreateMessageLine.ts";

import CreateMessageLine from "./CreateMessageLine.ts";

class Context {
  private _createMessageLine: CreateMessageLine | undefined;

  get createMessageLine(): CreateMessageLine {
    if (!this._createMessageLine) {
      this._createMessageLine = new CreateMessageLine(
        new CreateSimpleUpdate(),
        new CreateMessageLineFromSimpleUpdate(),
      );
    }

    return this._createMessageLine;
  }
}

export default Context;
