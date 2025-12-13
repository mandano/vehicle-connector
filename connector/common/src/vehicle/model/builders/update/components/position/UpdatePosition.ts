import Position from "../../../../../components/iot/Position.ts";
import UpdateState from "../state/UpdateState.ts";
import ClonePosition from "../../../../../components/iot/position/ClonePosition.ts";
import PositionToChanges from "../../../../../components/iot/position/PositionToChanges.ts";

import UpdatePositionInterface from "./UpdatePositionInterface.ts";
import UpdatePositionResult from "./UpdatePositionResult.ts";
import PositionChanges from "./PositionChanges.ts";

export default class UpdatePosition implements UpdatePositionInterface {
  constructor(
    private _updateState: UpdateState,
    private _clonePosition: ClonePosition,
    private _positionToChanges: PositionToChanges,
  ) {}

  public run(toBeUpdated: Position | undefined, updateBy: Position | undefined): UpdatePositionResult {
    if (updateBy === undefined && toBeUpdated === undefined) {
      return new UpdatePositionResult(undefined, undefined);
    }

    if (updateBy === undefined) {
      return new UpdatePositionResult(
        this._clonePosition.run(toBeUpdated!),
        undefined,
      );
    }

    if (toBeUpdated === undefined) {
      return new UpdatePositionResult(
        this._clonePosition.run(updateBy),
        this._positionToChanges.run(updateBy),
      );
    }

    const updateResultLatitude = this._updateState.run<number>(
      toBeUpdated.latitude,
      updateBy.latitude,
    );

    const updateResultLongitude = this._updateState.run<number>(
      toBeUpdated.longitude,
      updateBy.longitude,
    );

    const updateResultAccuracy = this._updateState.run<number>(
      toBeUpdated.accuracy,
      updateBy.accuracy,
    );

    const latitudeChanges = updateResultLatitude.changes;
    const longitudeChanges = updateResultLongitude.changes;
    const accuracyChanges = updateResultAccuracy.changes;

    let positionChanges: PositionChanges | undefined = undefined;

    if (
      latitudeChanges !== undefined ||
      longitudeChanges !== undefined ||
      accuracyChanges !== undefined
    ) {
      positionChanges = new PositionChanges(
        latitudeChanges,
        longitudeChanges,
        accuracyChanges,
      );
    }

    const position = new Position(
      updateResultLatitude.new!,
      updateResultLongitude.new!,
      toBeUpdated.createdAt,
      updateResultAccuracy.new,
    );

    return new UpdatePositionResult(position, positionChanges);
  }
}
