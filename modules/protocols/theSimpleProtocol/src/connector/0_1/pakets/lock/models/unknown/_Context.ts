import { CreateUnknown } from "./CreateUnknown.ts";

export class Context {
  private _createUnknown: CreateUnknown | undefined;

  get createUnknown(): CreateUnknown {
    if (!this._createUnknown) {
      this._createUnknown = new CreateUnknown();
    }

    return this._createUnknown;
  }
}
