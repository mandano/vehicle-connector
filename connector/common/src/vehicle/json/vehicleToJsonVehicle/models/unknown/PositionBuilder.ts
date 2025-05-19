import { Position } from "../../../../components/iot/Position.ts";
import { StateJson } from "../../../StateJson.ts";
import { JsonPosition } from "../../../iot/network/JsonPosition.ts";

export class PositionBuilder {
  public build(position: Position): JsonPosition {
    let accuracy = undefined;
    if (position.accuracy) {
      accuracy = new StateJson(
        position.accuracy.state,
        position.accuracy.originatedAt?.toISOString(),
        position.accuracy.updatedAt,
        position.accuracy.createdAt,
      );
    }

    return new JsonPosition(
      new StateJson(
        position.latitude.state,
        position.latitude.originatedAt?.toISOString(),
        position.latitude.updatedAt,
        position.latitude.createdAt,
      ),
      new StateJson(
        position.longitude.state,
        position.longitude.originatedAt?.toISOString(),
        position.longitude.updatedAt,
        position.longitude.createdAt,
      ),
      position.createdAt,
      accuracy,
    );
  }
}

export default PositionBuilder;
