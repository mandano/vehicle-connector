import { StateJson } from "../StateJson.ts";
import { State } from "../../State.ts";

export class SetState {
  public run<T>(stateJson: StateJson<T>): State<T> {
    const originatedAt = stateJson.originatedAt
      ? new Date(stateJson.originatedAt)
      : undefined;
    const updatedAt = stateJson.updatedAt
      ? new Date(stateJson.updatedAt)
      : undefined;

    const createdAt = stateJson.createdAt
      ? new Date(stateJson.createdAt)
      : undefined;

    return new State(stateJson.state, originatedAt, updatedAt, createdAt);
  }
}

export default SetState;

