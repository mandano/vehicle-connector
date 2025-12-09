import Unknown from "../../../../models/Unknown.ts";
import UnknownChanges from "../../../../models/unknown/UnknownChanges.ts";

export default class UpdateUnknownResult {
  constructor(
    private readonly _new: Unknown,
    private readonly _changes: UnknownChanges,
  ) {}

  get new(): Unknown {
    return this._new;
  }

  get changes(): UnknownChanges {
    return this._changes;
  }
}
