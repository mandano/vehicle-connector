import { BaseValidationRules } from "../../../../../../../../../../connector/common/src/vehicle/components/iot/network/protocol/messageLineContext/paket/messageLine/validation/BaseValidationRules.ts";
import { ValidationRulesInterface } from "../../../../../../../../../../connector/common/src/vehicle/components/iot/network/protocol/messageLineContext/paket/messageLine/validation/ValidationRulesInterface.ts";

export class ValidationRules
  extends BaseValidationRules
  implements ValidationRulesInterface
{
  public paketType = /^LOCK$/;
  public protocolVersion = /^0_1$/;
  public lock = /^(unlocked|locked)$/;
  public trackingId = /^.{5,45}$/;

  public getProperty(propertyName: string): RegExp | undefined {
    const property = this[propertyName as keyof ValidationRules];
    return property instanceof RegExp ? property : undefined;
  }
}
