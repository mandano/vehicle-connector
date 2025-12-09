import State from "../../../../../State.ts";
import StateDtoChanges from "../../../../../components/state/StateDtoChanges.ts";

export default class StateToChanges {
  public run<T>(state: State<T>): StateDtoChanges<T> {
    return new StateDtoChanges(
      state.state,
      state.originatedAt?.toISOString(),
      state.createdAt.toISOString(),
      state.updatedAt?.toISOString(),
    )
  }
}
