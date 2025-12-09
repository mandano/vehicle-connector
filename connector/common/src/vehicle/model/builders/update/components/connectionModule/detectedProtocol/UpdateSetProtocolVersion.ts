import State from "../../../../../../State.ts";
import UpdateStateResult from "../../state/UpdateStateResult.ts";
import StateDtoChanges from "../../../../../../components/state/StateDtoChanges.ts";

/**
 * setProtocolVersion is only set/updated initially. Actual update by user happens in dedicated endpoint and interactor.
 */
export default class UpdateSetProtocolVersion {
  public run(
    toBeUpdated: State<string> | undefined,
    updateBy: State<string> | undefined,
  ): UpdateStateResult<string> {
    const setProtocolVersion =
      toBeUpdated === undefined ? updateBy : toBeUpdated;

    let changes: StateDtoChanges<string> | undefined = undefined;
    if (toBeUpdated !== setProtocolVersion) {
      changes = new StateDtoChanges(
        setProtocolVersion?.state,
        setProtocolVersion?.originatedAt?.toISOString(),
        setProtocolVersion?.updatedAt?.toISOString(),
        setProtocolVersion?.createdAt?.toISOString(),
      );
    }

    return new UpdateStateResult<string>(setProtocolVersion, changes);
  }
}
