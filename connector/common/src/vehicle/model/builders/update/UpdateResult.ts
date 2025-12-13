import { types as modelTypes } from "../../models/types.ts";

import Changes from "./models/changes.ts";

export default class UpdateResult {
  constructor(
    public model: modelTypes,
    public changes: Changes | undefined,
  ) {}
}
