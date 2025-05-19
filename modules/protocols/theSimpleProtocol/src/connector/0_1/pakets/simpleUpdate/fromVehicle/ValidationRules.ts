import { ValidationRulesInterface } from "../../../../../../../../../connector/common/src/vehicle/components/iot/network/protocol/messageLineContext/paket/messageLine/validation/ValidationRulesInterface.ts";
import { BaseValidationRules } from "../../../../../../../../../connector/common/src/vehicle/components/iot/network/protocol/messageLineContext/paket/messageLine/validation/BaseValidationRules.ts";

export class ValidationRules
  extends BaseValidationRules
  implements ValidationRulesInterface
{
  public protocolVersion = /^0_1$/;
  public paketType = /^UPDATE_SIMPLE_SCOOTER$/;
  public latitude = /^(-?[0-8]?[0-9](\.[0-9]{1,15})?|90(\.0{1,15})?)$/;
  public longitude =
    /^(-?(1[0-7][0-9]|[0-9]{1,2})(\.[0-9]{1,15})?|180(\.0{1,15})?)$/;

  public getProperty(propertyName: string): RegExp | undefined {
    const property = this[propertyName as keyof ValidationRules];
    return property instanceof RegExp ? property : undefined;
  }
}
