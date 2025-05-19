import { State } from "../State.ts";
import { Lock } from "../components/lock/Lock.ts";

import { StateJson } from "./StateJson.ts";

export class JsonLock {
  public state: StateJson<typeof Lock.LOCKED | typeof Lock.UNLOCKED>;

  constructor(state: State<typeof Lock.LOCKED | typeof Lock.UNLOCKED>) {
    this.state = new StateJson(
      state.state,
      state.originatedAt?.toISOString(),
      state.updatedAt,
      state.createdAt,
    )
  }
}
