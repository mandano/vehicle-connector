import { Imei } from "../../../../../../../../../connector/common/src/vehicle/components/iot/network/protocol/Imei.ts";
import { SimpleUpdate } from "../../../../../connector/0_2/pakets/simpleUpdate/SimpleUpdate.ts";
import { THE_SIMPLE_PROTOCOL_ABBREVIATION } from "../../../../../Protocol.ts";
import { ID_0_2 } from "../../../../../versions.ts";

/**
 * T_S_P;0_2;17-808331-937761-2;UPDATE_SIMPLE_SCOOTER;2025-03-26T16:16:56.839Z;lat=-1.3393,latOriginatedAt=2025-03-26T16:16:56.839Z,lng=-15.8821,lngOriginatedAt=2025-03-26T16:16:56.839Z,mileage=6112559627482277,mileageOriginatedAt=2025-03-26T16:16:56.839Z,energy=7009762207329423,energyOriginatedAt=2025-03-26T16:16:56.839Z,speed=6186214279081677,speedOriginatedAt=2025-03-26T16:16:56.839Z,trackingId=undefined
 */
export class CreateMessageLine {
  private static latKey = "lat";
  private static lngKey = "lng";
  private static latOriginatedAtKey = "latOriginatedAt";
  private static lngOriginatedAtKey = "lngOriginatedAt";
  private static mileageKey = "mileage";
  private static mileageOriginatedAtKey = "mileageOriginatedAt";
  private static energyKey = "energy";
  private static energyOriginatedAtKey = "energyOriginatedAt";
  private static speedKey = "speed";
  private static speedOriginatedAtKey = "speedOriginatedAt";
  private static trackingIdKey = "trackingId";

  public run(update: SimpleUpdate, imei: Imei): string {
    const header = [
      THE_SIMPLE_PROTOCOL_ABBREVIATION,
      ID_0_2,
      imei,
      SimpleUpdate.messageLineKey,
      update.originatedAt.toISOString(),
    ].join(";");

    const data = [
      `${CreateMessageLine.latKey}=${update.latitude}`,
      `${CreateMessageLine.latOriginatedAtKey}=${update.latitudeOriginatedAt?.toISOString()}`,
      `${CreateMessageLine.lngKey}=${update.longitude}`,
      `${CreateMessageLine.lngOriginatedAtKey}=${update.longitudeOriginatedAt?.toISOString()}`,
      `${CreateMessageLine.mileageKey}=${update.mileage}`,
      `${CreateMessageLine.mileageOriginatedAtKey}=${update.mileageOriginatedAt?.toISOString()}`,
      `${CreateMessageLine.energyKey}=${update.energy}`,
      `${CreateMessageLine.energyOriginatedAtKey}=${update.energyOriginatedAt?.toISOString()}`,
      `${CreateMessageLine.speedKey}=${update.speed}`,
      `${CreateMessageLine.speedOriginatedAtKey}=${update.speedOriginatedAt?.toISOString()}`,
      `${CreateMessageLine.trackingIdKey}=${update.trackingId}`,
    ].join(",");

    return `${header};${data}`;
  }
}

export default CreateMessageLine;
