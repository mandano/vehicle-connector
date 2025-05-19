import {
  PROTOCOL,
  PROTOCOL_VERSION,
  IMEI,
  PAKET_TYPE,
  TRACKING_ID,
  TIME,
  LOCK,
} from "../../../attributeNames.ts";
import { ValidationOrderInterface } from "../../../../../../../../../../connector/common/src/vehicle/components/iot/network/protocol/messageLineContext/paket/messageLine/validation/ValidationOrderInterface.ts";

export class ValidationOrder implements ValidationOrderInterface {
  public attributes(): string[] {
    return [
      PROTOCOL,
      PROTOCOL_VERSION,
      IMEI,
      PAKET_TYPE,
      TIME,
      LOCK,
      TIME,
      TRACKING_ID,
    ];
  }
}
