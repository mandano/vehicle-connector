import Position from "../Position.ts";
import State from "../../../State.ts";

export default class ClonePosition {
  public run(position: Position): Position {
    const latitude = new State<number>(
      position.latitude.state,
      position.latitude.originatedAt,
      position.latitude.updatedAt,
      position.latitude.createdAt,
    );

    const longitude = new State<number>(
      position.longitude.state,
      position.longitude.originatedAt,
      position.longitude.updatedAt,
      position.longitude.createdAt,
    );

    let accuracy: State<number> | undefined = undefined;

    if (position.accuracy !== undefined) {
      accuracy = new State<number>(
        position.accuracy.state,
        position.accuracy.originatedAt,
        position.accuracy.updatedAt,
        position.accuracy.createdAt,
      );
    }

    return new Position(
      latitude,
      longitude,
      position.createdAt,
      accuracy,
    );
  }
}
