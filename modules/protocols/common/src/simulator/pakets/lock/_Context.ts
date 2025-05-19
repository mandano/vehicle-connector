import TheSimpleProtocolContext from "../../../../../theSimpleProtocol/src/_Context.ts";

import { CreateMessageLine } from "./CreateMessageLine.ts";

export class Context {
  private _lockToMessageLine: CreateMessageLine | undefined;

  constructor(private readonly _theSimpleProtocol: TheSimpleProtocolContext) {}

  get lockToMessageLine(): CreateMessageLine {
    if (!this._lockToMessageLine) {
      this._lockToMessageLine = new CreateMessageLine(
        this._theSimpleProtocol.simulator.common.toConnector.lock.createMessageLine,
      );
    }

    return this._lockToMessageLine;
  }
}
