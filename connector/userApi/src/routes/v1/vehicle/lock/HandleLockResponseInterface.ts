import { Lock } from "../../../../../../common/src/vehicle/components/lock/Lock.ts";

export interface HandleLockResponseInterface {
  run(
    actionRequestAsString: string,
    options?: {
      vehicleId: number;
      targetState: typeof Lock.LOCKED | typeof Lock.UNLOCKED;
    },
  ): Promise<boolean | undefined>;
}
