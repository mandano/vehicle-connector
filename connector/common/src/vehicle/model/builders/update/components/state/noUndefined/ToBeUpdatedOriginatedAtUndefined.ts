import State from "../../../../../../State.ts";
import StateDtoChanges from "../../../../../../components/state/StateDtoChanges.ts";

import UpdateStateResultNoUndefined from "./UpdateStateResultNoUndefined.ts";

/**
 * updateBy.originatedAt !== undefined &&
 * toBeUpdated.originatedAt === undefined
 */
export default class ToBeUpdatedOriginatedAtUndefined {
  public run<T>(
    toBeUpdated: State<T>,
    updateBy: State<T>,
  ): UpdateStateResultNoUndefined<T> {
    const changes: StateDtoChanges<T> = {};
    const updatedAt = new Date();

    if (updateBy.state !== toBeUpdated.state) {
      changes.state = updateBy.state;
    }

    changes.originatedAt = updateBy.originatedAt?.toISOString();

    if (updatedAt !== toBeUpdated.updatedAt) {
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
