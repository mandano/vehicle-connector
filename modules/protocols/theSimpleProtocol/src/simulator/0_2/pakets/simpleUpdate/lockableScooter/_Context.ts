import CreateSimpleUpdate from "../../../../../connector/0_2/pakets/simpleUpdate/CreateSimpleUpdate.ts";
import CreateMessageLine from "../toConnector/CreateMessageLine.ts";

import { ToMessageLine } from "./ToMessageLine.ts";

export class Context {
  private _toMessageLine: ToMessageLine | undefined;

  constructor(
    private readonly _creatMessageLine: CreateMessageLine,
  ) {}

  get toMessageLine(): ToMessageLine {
    if (!this._toMessageLine) {
      this._toMessageLine = new ToMessageLine(
        new CreateSimpleUpdate(),
        this._creatMessageLine,
      );
    }

    return this._toMessageLine;
  }
}
