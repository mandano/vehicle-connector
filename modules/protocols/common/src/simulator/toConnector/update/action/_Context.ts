import TheSimpleProtocolContext from "../../../../../../theSimpleProtocol/src/_Context.ts";

import CreateActionInterface from "./CreateActionInterface.ts";
import CreateAction from "./CreateAction.ts";

class Context {
  private _createAction: CreateActionInterface | undefined;

  constructor(
    private readonly _theSimpleProtocolContext: TheSimpleProtocolContext,
  ) {}

  get createAction(): CreateActionInterface {
    if (!this._createAction) {
      this._createAction = new CreateAction(
        this._theSimpleProtocolContext.simulator.common.toConnector.createAction,
      );
    }

    return this._createAction;
  }
}

export default Context;
