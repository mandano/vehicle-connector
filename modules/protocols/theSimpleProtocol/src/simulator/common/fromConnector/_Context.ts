import V0_1 from "../../0_1/_Context.ts";
import V0_2 from "../../0_2/_Context.ts";

import { CreateMessageLineContext } from "./CreateMessageLineContext.ts";

class Context {
  private _createMessageLineContext: CreateMessageLineContext | undefined;

  constructor(
    private readonly _v0_1: V0_1,
    private readonly _v0_2: V0_2,
  ) {}

  get createMessageLineContext(): CreateMessageLineContext {
    if (!this._createMessageLineContext) {
      this._createMessageLineContext = new CreateMessageLineContext(
        this._v0_1.common.fromConnector.actions.createMessageLineContext,
        this._v0_2.common.fromConnector.actions.createMessageLineContext,
      );
    }

    return this._createMessageLineContext;
  }
}

export default Context;
