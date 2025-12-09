import { types as modelTypes } from "../../models/types.ts";

import UpdateResult from "./UpdateResult.ts";

export default interface UpdateInterface {
  run(toBeUpdated: modelTypes, updateBy: modelTypes): UpdateResult | undefined;
}
