import ModelsContext from "./models/_Context.ts";
import VehicleToDto from "./VehicleToDto.ts";

export default class Context {
  private _models: ModelsContext | undefined;
  private _fromDto: VehicleToDto | undefined;

  public models(): ModelsContext {
    if (!this._models) {
      this._models = new ModelsContext();
    }

    return this._models;
  }

  public vehicleToDto(): VehicleToDto {
    if (!this._fromDto) {
      this._fromDto = new VehicleToDto(
        this.models().toUnknownDto(),
        this.models().toLockableScooterDto(),
      );
    }

    return this._fromDto;
  }
}
