import { ToModel } from "./ToModel.ts";
import { Context as UnknownContext } from "./unknown/_Context.ts";

export default class Context {
  private _toModel: ToModel | undefined;
  private _unknownContext: UnknownContext | undefined;

  get unknown(): UnknownContext {
    if (!this._unknownContext) {
      this._unknownContext = new UnknownContext();
    }

    return this._unknownContext;
  }

  get toModel(): ToModel {
    if (!this._toModel) {
      this._toModel = new ToModel(this.unknown.createUnknown);
    }

    return this._toModel;
  }
}
