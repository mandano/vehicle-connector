import State from "../../../../State.ts";
import IsState from "../../../../components/state/IsState.ts";

export default class SetState {
  public run<T>(state: unknown): State<T> | undefined {
    if (!IsState.run(state)) {
      return undefined;
    }

    const typedState = state as State<T>;

    const originatedAt = typedState.originatedAt
      ? new Date(typedState.originatedAt)
      : undefined;
    const updatedAt = typedState.updatedAt
      ? new Date(typedState.updatedAt)
      : undefined;

    const createdAt = typedState.createdAt
      ? new Date(typedState.createdAt)
      : undefined;

    return new State<T>(typedState.state, originatedAt, updatedAt, createdAt);
  }
}
