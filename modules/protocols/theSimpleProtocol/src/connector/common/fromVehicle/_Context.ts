import { Context as v0_1Context } from "../../0_1/_Context.ts";
import { Context as v0_2Context } from "../../0_2/_Context.ts";

import MessageLineContextContext from "./messageLineContext/_Context.ts";

class Context {
  private _messageLineContext: MessageLineContextContext | undefined;

  constructor(
    private _v0_1Context: v0_1Context,
    private _v0_2Context: v0_2Context,
  ) {}

  get messageLineContext(): MessageLineContextContext {
    if (!this._messageLineContext) {
      this._messageLineContext = new MessageLineContextContext(
        this._v0_1Context,
        this._v0_2Context,
      );
    }

    return this._messageLineContext;
  }
}

export default Context;
