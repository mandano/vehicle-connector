import { UpdatePositionInterface } from "../../../../../src/vehicle/model/builders/update/components/UpdatePositionInterface.ts";
import { Position } from "../../../../../src/vehicle/components/iot/Position.ts";

export class FakeUpdatePosition implements UpdatePositionInterface {
  private readonly _updated: Position;

  constructor(toBeUpdated: Position) {
    this._updated = toBeUpdated;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  run(toBeUpdated: Position, updateBy: Position): Position {
    Object.assign(toBeUpdated, this._updated);

    return this._updated;
  }
}
