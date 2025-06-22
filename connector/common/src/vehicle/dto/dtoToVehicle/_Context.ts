import SendActionRequestInterface from "../../model/actions/SendActionRequestInterface.ts";

import ModelsContext from "./models/_Context.ts";
import DtoToVehicle from "./DtoToVehicle.ts";

export default class Context {
  private _models: ModelsContext | undefined;
  private _dtoToVehicle: DtoToVehicle | undefined;

  constructor(
    private readonly _sendActionRequest: SendActionRequestInterface,
  ) {}

  public models(): ModelsContext {
    if (!this._models) {
      this._models = new ModelsContext(this._sendActionRequest);
    }

    return this._models;
  }

  public dtoToVehicle(): DtoToVehicle {
    if (!this._dtoToVehicle) {
      this._dtoToVehicle = new DtoToVehicle(
        this.models().fromLockableScooterDto(),
        this.models().fromUnknownDto(),
      );
    }

    return this._dtoToVehicle;
  }
}
