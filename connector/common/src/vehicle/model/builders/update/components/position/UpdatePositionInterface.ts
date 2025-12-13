import Position from "../../../../../components/iot/Position.ts";

import UpdatePositionResult from "./UpdatePositionResult.ts";

export interface UpdatePositionInterface {
  run(toBeUpdated: Position | undefined, updateBy: Position | undefined): UpdatePositionResult;
}

export default UpdatePositionInterface;