import { Imei } from "../../../../../../../../../connector/common/src/vehicle/components/iot/network/protocol/Imei.ts";
import { SimpleUpdate } from "../../../../../connector/0_1/pakets/simpleUpdate/SimpleUpdate.ts";
import { THE_SIMPLE_PROTOCOL_ABBREVIATION } from "../../../../../Protocol.ts";
import { ID_0_1 } from "../../../../../versions.ts";

/**
 * T_S_P;0_1;13456789;UPDATE_SIMPLE_SCOOTER;2021-01-01T00:00:00.000Z;lat=12.4567,lat_timestamp=2021-01-01T00:00:00.000Z,lng=12.4567,lng_timestamp=2021-01-01T00:00:00.000Z
 */
export class CreateMessageLine {
  private static paketName = "UPDATE_SIMPLE_SCOOTER";
  private static latKey = "lat";
  private static lngKey = "lng";
  private static latOriginatedAtKey = "latOriginatedAt";
  private static lngOriginatedAtKey = "lngOriginatedAt";

  public run(update: SimpleUpdate, imei: Imei): string {
    const header = [
      THE_SIMPLE_PROTOCOL_ABBREVIATION,
      ID_0_1,
      imei,
      CreateMessageLine.paketName,
      new Date().toISOString(),
    ].join(";");
    let data = [
      `${CreateMessageLine.latKey}=${update.latitude}`,
      `${CreateMessageLine.latOriginatedAtKey}=${update.latitudeOriginatedAt.toISOString()}`,
      `${CreateMessageLine.lngKey}=${update.longitude}`,
      `${CreateMessageLine.lngOriginatedAtKey}=${update.longitudeOriginatedAt.toISOString()}`,
    ].join(",");

    if (update.trackingId !== undefined) {
      data += `,${update.trackingId}`;
    }

    return `${header};${data}`;
  }
}

export default CreateMessageLine;
