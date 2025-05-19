import { LoggerInterface } from "../../../../../../../../../logger/LoggerInterface.ts";

import { ValidateInterface } from "./ValidateInterface.ts";
import { ValidationOrderInterface } from "./ValidationOrderInterface.ts";
import { ValidationRulesInterface } from "./ValidationRulesInterface.ts";

export class Validate implements ValidateInterface {
  private _failedValidations: string[] = [];

  constructor(
    private _validationRules: ValidationRulesInterface,
    private _validationOrder: ValidationOrderInterface,
    private _logger: LoggerInterface,
  ) {}

  public run(messageItems: string[]): boolean {
    const failedValidations = [];

    this._validationOrder.attributes().forEach((attributeName, idx) => {
      const item = messageItems[idx];

      if (!this.validate(item, attributeName)) {
        failedValidations.push({ [attributeName]: item });
      }
    });

    if (this._failedValidations.length > 0) {
      const failedValidationsAsJsonStr = JSON.stringify(
        this._failedValidations,
      );
      this._logger.error(
        `Failed validations: ${failedValidationsAsJsonStr}`,
        Validate.name,
      );
    }

    return failedValidations.length === 0;
  }

  private validate(
    messageItem: string,
    attributeName: string,
  ): boolean | undefined {
    const validationRule = this._validationRules.getProperty(attributeName);

    if (!this.isRegex(validationRule)) {
      return undefined;
    }

    if (validationRule === undefined) {
      return undefined;
    }

    const validationSuccessful = validationRule.test(messageItem);

    if (!validationSuccessful) {
      this._failedValidations.push(
        `attributeName ${attributeName}, messageItem ${messageItem}, validationRule ${validationRule}`,
      );
    }

    return validationSuccessful;
  }

  private isRegex(validationRule: unknown): validationRule is RegExp {
    return validationRule instanceof RegExp;
  }
}
