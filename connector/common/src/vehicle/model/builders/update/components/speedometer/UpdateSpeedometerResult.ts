import Speedometer from "../../../../../components/speedometer/Speedometer.ts";
import StateDtoChanges from "../../../../../components/state/StateDtoChanges.ts";

export default class UpdateSpeedometerResult {
  constructor(
    private readonly _new: Speedometer | undefined,
    private readonly _changes: StateDtoChanges<number> | undefined,
  ) {}

  get new(): Speedometer | undefined {
    return this._new;
  }

  get changes(): StateDtoChanges<number> | undefined {
    return this._changes;
  }
}
