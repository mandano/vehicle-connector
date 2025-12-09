import State from "../../../../../../State.ts";
import UpdateStateResult from "../../state/UpdateStateResult.ts";
import StateDtoChanges from "../../../../../../components/state/StateDtoChanges.ts";

export default class UpdateSetProtocol {
  public run(
    toBeUpdated: State<string> | undefined,
    updateBy: State<string> | undefined,
  ): UpdateStateResult<string> {
    const setProtocol = toBeUpdated === undefined ? updateBy : toBeUpdated;

    let changesSetProtocol: StateDtoChanges<string> | undefined = undefined;
    if (toBeUpdated !== setProtocol) {
      changesSetProtocol = new StateDtoChanges(
        setProtocol?.state,
        setProtocol?.originatedAt?.toISOString(),
        setProtocol?.updatedAt?.toISOString(),
        setProtocol?.createdAt?.toISOString(),
      );
    }

    return new UpdateStateResult<string>(setProtocol, changesSetProtocol);
  }
}
