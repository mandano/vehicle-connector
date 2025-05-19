import { Context as ConnectorContext } from "../../../../connector/_Context.ts";

import ActionsContext from "./actions/_Context.ts";

class Context {
  private _actionsContext: ActionsContext | undefined;

  constructor(private _connectorContext: ConnectorContext) {}

  get actions(): ActionsContext {
    if (!this._actionsContext) {
      this._actionsContext = new ActionsContext(this._connectorContext);
    }
    return this._actionsContext;
  }
}

export default Context;
