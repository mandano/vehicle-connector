import CreateSimpleUpdate from "../../pakets/simpleUpdate/fromVehicle/CreateSimpleUpdate.ts";
import CreateLock from "../../pakets/lock/fromVehicle/CreateLock.ts";

import CreateMessageLineContext from "./CreateMessageLineContext.ts";

export class Context {
  private _createMessageLineContext: CreateMessageLineContext | undefined;

  constructor(
    private readonly _createSimpleUpdate: CreateSimpleUpdate,
    private readonly _createLock: CreateLock,
  ) {}

  get createMessageLineContext(): CreateMessageLineContext {
    if (!this._createMessageLineContext) {
      this._createMessageLineContext = new CreateMessageLineContext(
        this._createSimpleUpdate,
        this._createLock,
      );
    }
    return this._createMessageLineContext;
  }
}

export default Context;
