import Batteries from "../../../../../../components/energy/Batteries.ts";

import BatteriesChanges from "./BatteriesChanges.ts";

export default class UpdateBatteriesResult {
  constructor(
    private readonly _new: Batteries | undefined,
    private readonly _changes: BatteriesChanges | undefined,
  ) {}

  get new(): Batteries | undefined {
    return this._new;
  }

  get changes(): BatteriesChanges | undefined {
    return this._changes;
  }
}
