import State from "../../../../State.ts";

export class UpdateState {
  public run<T>(
    toBeUpdated: State<T> | undefined,
    updateBy: State<T> | undefined,
  ): State<T> | undefined {
    if (toBeUpdated === undefined && updateBy !== undefined) {
      return new State(
        updateBy.state,
        updateBy.originatedAt,
        updateBy.updatedAt,
        updateBy.createdAt,
      );
    }

    if (toBeUpdated !== undefined && updateBy === undefined) {
      return new State(
        toBeUpdated.state,
        toBeUpdated.originatedAt,
        toBeUpdated.updatedAt,
        toBeUpdated.createdAt,
      );
    }

    if (toBeUpdated === undefined || updateBy === undefined) {
      return undefined;
    }

    if (
      updateBy.originatedAt !== undefined &&
      toBeUpdated.originatedAt === undefined
    ) {
      return new State(
        updateBy.state,
        updateBy.originatedAt,
        updateBy.updatedAt,
        updateBy.createdAt,
      );
    }

    if (
      updateBy.originatedAt === undefined &&
      toBeUpdated.originatedAt !== undefined
    ) {
      return new State(
        toBeUpdated.state,
        toBeUpdated.originatedAt,
        toBeUpdated.updatedAt,
        toBeUpdated.createdAt,
      );
    }

    if (
      updateBy.originatedAt === undefined &&
      toBeUpdated.originatedAt === undefined
    ) {
      return new State(
        updateBy.state,
        undefined,
        new Date(),
        toBeUpdated.createdAt,
      );
    }

    if (
      updateBy.originatedAt !== undefined &&
      toBeUpdated.originatedAt !== undefined &&
      updateBy.originatedAt > toBeUpdated.originatedAt
    ) {
      return new State(
        updateBy.state,
        updateBy.originatedAt,
        new Date(),
        toBeUpdated.createdAt,
      );
    }

    return toBeUpdated;
  }
}

export default UpdateState;
