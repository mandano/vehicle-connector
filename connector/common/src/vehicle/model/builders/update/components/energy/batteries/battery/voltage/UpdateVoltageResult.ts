import State from "../../../../../../../../State.ts";
import StateDtoChanges from "../../../../../../../../components/state/StateDtoChanges.ts";

export default class UpdateVoltageResult {
  constructor(
    private readonly _new: State<number> | undefined,
    private readonly _changes: StateDtoChanges<number> | undefined,
  ) {}

  get new(): State<number> | undefined {
    return this._new;
  }

  get changes(): StateDtoChanges<number> | undefined {
    return this._changes;
  }
}
