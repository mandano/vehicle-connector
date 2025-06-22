import { Vehicle } from "../../../../../connector/common/src/vehicle/Vehicle.ts";
import { LoggerInterface } from "../../../../../connector/common/src/logger/LoggerInterface.ts";
import { Lock } from "../../../../../connector/common/src/vehicle/components/lock/Lock.ts";
import { FakeSendActionRequest } from "../../../../../connector/common/test/vehicle/model/actions/FakeSendActionRequest.ts";
import { LockState } from "../../../../../connector/common/src/vehicle/components/lock/LockState.ts";
import ContainsLockCheck from "../../../../../connector/common/src/vehicle/components/lock/ContainsLockCheck.ts";

export class OnLockRequest {
  constructor(
    private _logger: LoggerInterface,
    private _faultRatio: number,
  ) {}

  public run(vehicle: Vehicle, lockState: LockState) {
    if (!ContainsLockCheck.run(vehicle.model)) {
      return undefined;
    }

    const randomValue = Math.random();

    if (randomValue <= this._faultRatio) {
      this._logger.debug(`Fault ratio reached`, OnLockRequest.name);

      return false;
    }

    if (vehicle.model.lock === undefined) {
      vehicle.model.lock = new Lock(
        new FakeSendActionRequest(),
        lockState,
      );
    } else if (vehicle.model.lock.state === undefined) {
      vehicle.model.lock.state = lockState;
      vehicle.model.lock.state.state.originatedAt = new Date();
      vehicle.model.lock.state.state.updatedAt = new Date();
    } else {
      vehicle.model.lock.state = lockState;
      vehicle.model.lock.state.state.originatedAt = new Date();
      vehicle.model.lock.state.state.updatedAt = new Date();
    }
  }
}
