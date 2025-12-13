import Position from "../../../../../components/iot/Position.ts";

import PositionChanges from "./PositionChanges.ts";

export default class UpdatePositionResult {
  constructor(
    private readonly _new: Position | undefined,
    private readonly _changes: PositionChanges | undefined,
  ) {
  }

  get new(): Position | undefined {
    return this._new;
  }

  get changes(): PositionChanges | undefined {
    return this._changes;
  }
}
