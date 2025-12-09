import State from "../../../../../../State.ts";
import StateDtoChanges from "../../../../../../components/state/StateDtoChanges.ts";

export default class UpdateStateResultNoUndefined<T> {
  constructor(
    private readonly _new: State<T>,
    private readonly _changes: StateDtoChanges<T> | undefined,
  ) {}

  get new(): State<T> {
    return this._new;
  }

  get changes(): StateDtoChanges<T> | undefined {
    return this._changes;
  }
}
