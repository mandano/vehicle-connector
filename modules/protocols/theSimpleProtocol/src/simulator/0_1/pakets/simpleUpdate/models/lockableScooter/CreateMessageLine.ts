import { LockableScooter } from "../../../../../../../../../../connector/common/src/vehicle/model/models/LockableScooter.ts";
import { CreateSimpleUpdate } from "../../../../../../connector/0_1/pakets/simpleUpdate/CreateSimpleUpdate.ts";
import BuildMessageLine from "../../toConnector/CreateMessageLine.ts";

class CreateMessageLine {
  constructor(
    private readonly _createUpdateSimpleScooter: CreateSimpleUpdate,
    private readonly _buildMessageLine: BuildMessageLine,
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

    const updateSimpleScooter = this._createUpdateSimpleScooter.run({
      latitude: model.ioT.position.latitude.state,
      latitudeOriginatedAt: model.ioT.position.latitude.originatedAt,
      longitude: model.ioT.position.longitude.state,
      longitudeOriginatedAt: model.ioT.position.longitude.originatedAt,
      imei: imei,
    });

    return this._buildMessageLine.run(updateSimpleScooter, imei);
  }
}

export default CreateMessageLine;
