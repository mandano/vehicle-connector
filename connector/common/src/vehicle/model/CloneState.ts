import State from "../State.ts";

export default class CloneState<T> {
  public run(state: State<T> | undefined): State<T> | undefined {
    if (state === undefined) {
      return undefined;
    }

    return new State<T>(
      state.state,
      state.originatedAt,
      state.updatedAt,
      state.createdAt,
    );
  }
}
