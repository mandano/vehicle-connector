import { State } from "../../../../State.ts";

export class UpdateState {
  public run<T>(
    toBeUpdated: State<T> | undefined,
    updateBy: State<T> | undefined,
  ): State<T> | undefined {
    if (toBeUpdated === undefined && updateBy !== undefined) {
      return updateBy;
    }

    if (toBeUpdated !== undefined && updateBy === undefined) {
      return toBeUpdated;
    }

    if (toBeUpdated === undefined || updateBy === undefined) {
      return undefined;
    }

    if (
      updateBy.originatedAt !== undefined &&
      toBeUpdated.originatedAt === undefined
    ) {
      return updateBy;
    }

    if (
      updateBy.originatedAt === undefined &&
      toBeUpdated.originatedAt !== undefined
    ) {
      return toBeUpdated;
    }

    if (
      updateBy.originatedAt === undefined &&
      toBeUpdated.originatedAt === undefined
    ) {
      toBeUpdated.state = updateBy.state;
      toBeUpdated.updatedAt = new Date();
    }

    if (
      updateBy.originatedAt !== undefined &&
      toBeUpdated.originatedAt !== undefined &&
      updateBy.originatedAt > toBeUpdated.originatedAt
    ) {
      toBeUpdated.state = updateBy.state;
      toBeUpdated.originatedAt = updateBy.originatedAt;
      toBeUpdated.updatedAt = new Date();
    }

    return toBeUpdated;
  }
}
