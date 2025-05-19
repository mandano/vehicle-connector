import { LockableScooter } from "../../../../../../../../../connector/common/src/vehicle/model/models/LockableScooter.ts";
import CreateSimpleUpdate from "../../../../../connector/0_2/pakets/simpleUpdate/CreateSimpleUpdate.ts";
import CreateMessageLine from "../toConnector/CreateMessageLine.ts";

export class ToMessageLine {
  constructor(
    private readonly _createSimpleUpdate: CreateSimpleUpdate,
    private readonly _createMessageLine: CreateMessageLine,
  ) {}

  public run(model: LockableScooter): string | undefined {
    if (
      model.ioT === undefined ||
      model.ioT.position === undefined ||
      model.ioT.network === undefined
    ) {
      return undefined;
    }

    const imei = model.ioT.network.getImeiOfFirstConnectionModule();

    if (imei === undefined) {
      return undefined;
    }

    const updateSimpleScooter = this._createSimpleUpdate.run({
      latitude: model.ioT.position.latitude.state,
      latitudeOriginatedAt: model.ioT.position.latitude.originatedAt,
      longitude: model.ioT.position.longitude.state,
      longitudeOriginatedAt: model.ioT.position.longitude.originatedAt,
      imei: imei,
      mileage: model.odometer?.state.state,
      mileageOriginatedAt: model.odometer?.state.originatedAt,
      energy: model.batteries?.getAvgLevelRounded(),
      energyOriginatedAt: model.batteries?.latestOriginateAt(),
      speed: model.speedometer?.state.state,
      speedOriginatedAt: model.speedometer?.state.originatedAt,
    });

    if (updateSimpleScooter === undefined) {
      return undefined;
    }

    return this._createMessageLine.run(updateSimpleScooter, imei);
  }
}

export default ToMessageLine;
