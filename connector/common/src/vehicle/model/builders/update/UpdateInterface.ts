import { types as modelTypes } from "../../models/types.ts";

export interface UpdateInterface {
  run(toBeUpdated: modelTypes, updateBy: modelTypes): modelTypes | undefined;
}
