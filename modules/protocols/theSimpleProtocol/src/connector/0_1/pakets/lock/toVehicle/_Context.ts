import { CreateMessageLine } from "./CreateMessageLine.ts";

export class Context {
  private _destinationBuildMessageLine: CreateMessageLine | undefined;

  get buildMessageLine(): CreateMessageLine {
    if (!this._destinationBuildMessageLine) {
      this._destinationBuildMessageLine = new CreateMessageLine();
    }

    return this._destinationBuildMessageLine;
  }
}

export default Context;
