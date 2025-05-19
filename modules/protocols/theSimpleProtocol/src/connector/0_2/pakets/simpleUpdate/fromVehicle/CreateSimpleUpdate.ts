import { ValidateInterface } from "../../../../../../../../../connector/common/src/vehicle/components/iot/network/protocol/messageLineContext/paket/messageLine/validation/ValidateInterface.ts";
import { SimpleUpdate } from "../SimpleUpdate.ts";
import { MessageLineSplitterInterface } from "../../../../../../../../../connector/common/src/vehicle/components/iot/network/protocol/messageLineContext/paket/messageLine/MessageLineSplitterInterface.ts";

import { Sanitize } from "./Sanitize.ts";
import CreateSimpleUpdateInterface from "./CreateSimpleUpdateInterface.ts";

/**
 * T_S_P;0_2;17-808331-937761-2;UPDATE_SIMPLE_SCOOTER;2025-03-26T16:16:56.839Z;lat=-1.3393,latOriginatedAt=2025-03-26T16:16:56.839Z,lng=-15.8821,lngOriginatedAt=2025-03-26T16:16:56.839Z,mileage=6112559627482277,mileageOriginatedAt=2025-03-26T16:16:56.839Z,energy=7009762207329423,energyOriginatedAt=2025-03-26T16:16:56.839Z,speed=6186214279081677,speedOriginatedAt=2025-03-26T16:16:56.839Z,trackingId=undefined
 */
export class CreateSimpleUpdate implements CreateSimpleUpdateInterface {
  constructor(
    private _validate: ValidateInterface,
    private _messageLineSplitter: MessageLineSplitterInterface,
    private _sanitize: Sanitize,
  ) {}

  public run(messageLine: string): SimpleUpdate | undefined {
    const items = this._messageLineSplitter.run(messageLine);

    if (items === undefined) {
      return undefined;
    }

    if (!this._validate.run(items)) {
      return undefined;
    }

    const sanitizedItems = this._sanitize.run(items);

    const protocolVersion = sanitizedItems[1];
    const imei = sanitizedItems[2];

    if (imei === undefined || protocolVersion === undefined) {
      return undefined;
    }

    const originatedAt = sanitizedItems[4]
      ? new Date(sanitizedItems[4])
      : undefined;

    if (originatedAt === undefined) {
      return undefined;
    }

    const latitude = Number(sanitizedItems[5]);
    const latitudeOriginatedAt = sanitizedItems[6]
      ? new Date(sanitizedItems[6])
      : undefined;
    const longitude = Number(sanitizedItems[7]);
    const longitudeOriginatedAt = sanitizedItems[8]
      ? new Date(sanitizedItems[8])
      : undefined;
    const mileage = Number(sanitizedItems[9]);
    const mileageOriginatedAt = sanitizedItems[10]
      ? new Date(sanitizedItems[10])
      : undefined;
    const energy = Number(sanitizedItems[11]);
    const energyOriginatedAt = sanitizedItems[12]
      ? new Date(sanitizedItems[12])
      : undefined;
    const speed = Number(sanitizedItems[13]);
    const speedOriginatedAt = sanitizedItems[14]
      ? new Date(sanitizedItems[14])
      : undefined;
    const trackingId = sanitizedItems[15];

    return new SimpleUpdate(
      imei,
      protocolVersion,
      originatedAt,
      latitude,
      latitudeOriginatedAt,
      longitude,
      longitudeOriginatedAt,
      mileage,
      mileageOriginatedAt,
      energy,
      energyOriginatedAt,
      speed,
      speedOriginatedAt,
      trackingId,
    );
  }
}

export default CreateSimpleUpdate;
