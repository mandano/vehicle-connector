import { ValidationRulesInterface } from "../../../../../../../../../../connector/common/src/vehicle/components/iot/network/protocol/messageLineContext/paket/messageLine/validation/ValidationRulesInterface.ts";
import { ValidationRules as ValidationRulesV0_1 } from "../../../../../0_1/pakets/lock/fromVehicle/validation/ValidationRules.ts";

export class ValidationRules
  extends ValidationRulesV0_1
  implements ValidationRulesInterface
{
  public protocolVersion = /^0_2$/;
}
