import PositionChanges from "../../../model/builders/update/components/position/PositionChanges.ts";
import StateDto from "../../state/StateDto.ts";
import Position from "../Position.ts";

export default class PositionToChanges {
  public run(position: Position): PositionChanges {
    const positionChanges = new PositionChanges(
      new StateDto(
        position.latitude.state,
        position.latitude.originatedAt?.toISOString(),
        position.latitude.createdAt.toISOString(),
        position.latitude.updatedAt?.toISOString(),
      ),
      new StateDto(
        position.longitude.state,
        position.longitude.originatedAt?.toISOString(),
        position.longitude.createdAt.toISOString(),
        position.longitude.updatedAt?.toISOString(),
      ),
    );

    if (position.accuracy !== undefined) {
      positionChanges.accuracy = new StateDto(
        position.accuracy.state,
        position.accuracy.originatedAt?.toISOString(),
        position.accuracy.createdAt.toISOString(),
        position.accuracy.updatedAt?.toISOString(),
      );
    }

    return positionChanges;
  }
}
