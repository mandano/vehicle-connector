import State from "../../../../../State.ts";
import StateDtoChanges from "../../../../../components/state/StateDtoChanges.ts";

export default class UpdateStateResult<T> {
  constructor(
    private readonly _new: State<T> | undefined,
    private readonly _changes: StateDtoChanges<T> | undefined,
  ) {}

  get new(): State<T> | undefined {
    return this._new;
  }

  get changes(): StateDtoChanges<T> | undefined {
    return this._changes;
  }
}
