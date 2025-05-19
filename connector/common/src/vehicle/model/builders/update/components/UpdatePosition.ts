import { Position } from "../../../../components/iot/Position.ts";

import { UpdateState } from "./UpdateState.ts";
import { UpdatePositionInterface } from "./UpdatePositionInterface.ts";

export class UpdatePosition implements UpdatePositionInterface {
  private _updateState: UpdateState;

  constructor(updateState: UpdateState) {
    this._updateState = updateState;
  }

  public run(toBeUpdated: Position, updateBy: Position): Position {
    if (updateBy.latitude === undefined || updateBy.longitude === undefined) {
      return toBeUpdated;
    }

    if (toBeUpdated.latitude === undefined) {
      toBeUpdated.latitude = updateBy.latitude;
    }

    if (toBeUpdated.latitude !== undefined) {
      const latitude = this._updateState.run(
        toBeUpdated.latitude,
        updateBy.latitude,
      );
      if (latitude !== undefined) {
        toBeUpdated.latitude = latitude;
      }
    }

    if (toBeUpdated.longitude === undefined) {
      toBeUpdated.longitude = updateBy.longitude;
    }

    if (toBeUpdated.longitude !== undefined) {
      const longitude = this._updateState.run(
        toBeUpdated.longitude,
        updateBy.longitude,
      );
      if (longitude !== undefined) {
        toBeUpdated.longitude = longitude;
      }
    }

    if (toBeUpdated.accuracy === undefined && updateBy.accuracy !== undefined) {
      toBeUpdated.accuracy = updateBy.accuracy;
    }

    if (toBeUpdated.accuracy !== undefined) {
      const accuracy = this._updateState.run(
        toBeUpdated.accuracy,
        updateBy.accuracy,
      );
      if (accuracy !== undefined) {
        toBeUpdated.accuracy = accuracy;
      }
    }

    return toBeUpdated;
  }
}
