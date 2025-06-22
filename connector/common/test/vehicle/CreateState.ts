import State from "../../src/vehicle/State.ts";

export default class CreateState<T> {
  public run(
    state: T,
    originatedAt: Date = new Date(),
    updatedAt: Date | undefined = undefined,
    createdAt: Date = new Date(),
  ): State<T> {
    return new State(state, originatedAt, updatedAt, createdAt);
  }
}
