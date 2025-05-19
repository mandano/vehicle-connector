import TheSimpleProtocolContext from "../../../../theSimpleProtocol/src/_Context.ts";

import MessageLineContextContext from "./messageLineContext/_Context.ts";

export class Context {
  private _messageLineContext: MessageLineContextContext | undefined;

  constructor(private readonly _theSimpleProtocol: TheSimpleProtocolContext) {}

  get messageLineContext() {
    if (!this._messageLineContext) {
      this._messageLineContext = new MessageLineContextContext(
        this._theSimpleProtocol,
      );
    }
    return this._messageLineContext;
  }
}

export default Context;
