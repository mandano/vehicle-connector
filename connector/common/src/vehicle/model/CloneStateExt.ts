import State from "../State.ts";

export default class CloneStateExt {
  public run<T>(state: State<T>): State<T> {
    return new State<T>(
      state.state,
      state.originatedAt,
      state.updatedAt,
      state.createdAt,
    );
  }
}
