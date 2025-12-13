import State from "../State.ts";

export default class CloneState<T> {
  public run(state: State<T>): State<T> {
    return new State<T>(
      state.state,
      state.originatedAt,
      state.updatedAt,
      state.createdAt,
    );
  }
}
