import { State } from "../State.ts";

import { StateJson } from "./StateJson.ts";

export class JsonSpeedometer {
  public state: StateJson<number>;

  constructor(state: State<number>) {
    this.state = new StateJson(
      state.state,
      state.originatedAt?.toISOString(),
      state.updatedAt,
      state.createdAt,
    )
  }
}
