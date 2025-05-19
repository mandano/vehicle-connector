import { Position } from "../../../../components/iot/Position.ts";

export interface UpdatePositionInterface {
  run(toBeUpdated: Position, updateBy: Position): Position;
}
