import { Context as UnknownContext } from "./unknown/_Context.ts";
import { ToModel } from "./ToModel.ts";

export class Context {
  private _unknown: UnknownContext | undefined;
  private _toModel: ToModel | undefined;

  get unknown(): UnknownContext {
    if (!this._unknown) {
      this._unknown = new UnknownContext();
    }

    return this._unknown;
  }

  get toModel(): ToModel {
    if (!this._toModel) {
      this._toModel = new ToModel(
        this.unknown.createUnknown,
      );
    }

    return this._toModel;
  }
}

export default Context;
