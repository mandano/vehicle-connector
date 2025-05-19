import CreateUpdateSimpleScooter from "../simpleUpdate/models/ToModel.ts";
import CreateLock from "../lock/models/ToModel.ts";

import ToModel from "./ToModel.ts";

export default class Context {
  private _toModel: ToModel | undefined;

  constructor(
    private _createUpdateSimpleScooter: CreateUpdateSimpleScooter,
    private _createLock: CreateLock,
  ) {}

  get toModel(): ToModel {
    if (!this._toModel) {
      this._toModel = new ToModel(
        this._createUpdateSimpleScooter,
        this._createLock,
      );
    }
    return this._toModel;
  }
}
