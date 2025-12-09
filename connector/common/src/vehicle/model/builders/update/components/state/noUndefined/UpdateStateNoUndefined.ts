import State from "../../../../../../State.ts";

import UpdateStateResultNoUndefined from "./UpdateStateResultNoUndefined.ts";
import ToBeUpdatedOriginatedAtUndefined from "./ToBeUpdatedOriginatedAtUndefined.ts";
import OriginatedAtUndefined from "./OriginatedAtUndefined.ts";
import Update from "./Update.ts";

export default class UpdateStateNoUndefined {
  constructor(
    private _toBeUpdatedOriginatedAtUndefined: ToBeUpdatedOriginatedAtUndefined,
    private _originatedAtUndefined: OriginatedAtUndefined,
    private _update: Update,
  ) {}

  public run<T>(
    toBeUpdated: State<T>,
    updateBy: State<T>,
  ): UpdateStateResultNoUndefined<T> {
    if (
      updateBy.originatedAt !== undefined &&
      toBeUpdated.originatedAt === undefined
    ) {
      return this._toBeUpdatedOriginatedAtUndefined.run<T>(
        toBeUpdated,
        updateBy,
      );
    }

    if (
      updateBy.originatedAt === undefined &&
      toBeUpdated.originatedAt !== undefined
    ) {
      return this.noUpdate(toBeUpdated);
    }

    if (
      updateBy.originatedAt === undefined &&
      toBeUpdated.originatedAt === undefined
    ) {
      return this._originatedAtUndefined.run<T>(toBeUpdated, updateBy);
    }

    if (
      updateBy.originatedAt !== undefined &&
      toBeUpdated.originatedAt !== undefined &&
      updateBy.originatedAt > toBeUpdated.originatedAt
    ) {
      return this._update.run<T>(toBeUpdated, updateBy);
    }

    return new UpdateStateResultNoUndefined<T>(
      new State(
        toBeUpdated.state,
        toBeUpdated.originatedAt,
        toBeUpdated.updatedAt,
        toBeUpdated.createdAt,
      ),
      undefined,
    );
  }

  private noUpdate<T>(toBeUpdated: State<T>): UpdateStateResultNoUndefined<T> {
    return new UpdateStateResultNoUndefined<T>(
      new State(
        toBeUpdated.state,
        toBeUpdated.originatedAt,
        toBeUpdated.updatedAt,
        toBeUpdated.createdAt,
      ),
      undefined,
    );
  }
}
