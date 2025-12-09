import { UpdatePositionInterface } from "../../../../../src/vehicle/model/builders/update/components/position/UpdatePositionInterface.ts";
import { Position } from "../../../../../src/vehicle/components/iot/Position.ts";
import UpdatePositionResult
  from "../../../../../src/vehicle/model/builders/update/components/position/UpdatePositionResult.js";

export class FakeUpdatePosition implements UpdatePositionInterface {
  private readonly _updated: Position;

  constructor(toBeUpdated: Position) {
    this._updated = toBeUpdated;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  run(toBeUpdated: Position | undefined, updateBy: Position | undefined): UpdatePositionResult {
    if (toBeUpdated !== undefined) {
      Object.assign(toBeUpdated, this._updated);
    }

    return new UpdatePositionResult(this._updated, undefined);
  }
}
