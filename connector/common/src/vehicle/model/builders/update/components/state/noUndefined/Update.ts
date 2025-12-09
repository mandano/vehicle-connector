import State from "../../../../../../State.ts";
import StateDtoChanges from "../../../../../../components/state/StateDtoChanges.ts";

import UpdateStateResultNoUndefined from "./UpdateStateResultNoUndefined.ts";

export default class Update {
  public run<T>(
    toBeUpdated: State<T>,
    updateBy: State<T>,
  ): UpdateStateResultNoUndefined<T> {
    const changes: StateDtoChanges<T> = {};
    const updatedAt = new Date();

    if (updateBy.state !== toBeUpdated.state) {
      changes.state = updateBy.state;
    }

    if (updateBy.originatedAt !== toBeUpdated.originatedAt) {
      changes.originatedAt = updateBy.originatedAt?.toISOString();
    }

    if (updateBy.updatedAt !== updatedAt) {
      changes.updatedAt = updatedAt.toISOString();
    }

    return new UpdateStateResultNoUndefined<T>(
      new State(
        updateBy.state,
        updateBy.originatedAt,
        updatedAt,
        toBeUpdated.createdAt,
      ),
      changes,
    );
  }
}
