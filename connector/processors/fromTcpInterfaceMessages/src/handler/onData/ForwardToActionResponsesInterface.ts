import { Lock } from "../../../../../common/src/vehicle/components/lock/Lock.ts";

export interface ForwardToActionResponsesInterface {
  run(
    lockState: typeof Lock.UNLOCKED | typeof Lock.LOCKED,
    vehicleId: number,
  ): Promise<boolean | undefined>;
}
