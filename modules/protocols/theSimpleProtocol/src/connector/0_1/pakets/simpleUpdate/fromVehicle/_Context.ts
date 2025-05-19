import { Validate } from "../../../../../../../../../connector/common/src/vehicle/components/iot/network/protocol/messageLineContext/paket/messageLine/validation/Validate.ts";
import { LoggerInterface } from "../../../../../../../../../connector/common/src/logger/LoggerInterface.ts";

import { MessageLineSplitter } from "./MessageLineSplitter.ts";
import { ValidationOrder } from "./ValidationOrder.ts";
import { ValidationRules } from "./ValidationRules.ts";
import { CreateSimpleUpdate } from "./CreateSimpleUpdate.ts";

export class Context {
  private _messageLineSplitter: MessageLineSplitter | undefined;

  private _validationOrder: ValidationOrder | undefined;
  private _validationRules: ValidationRules | undefined;

  constructor(private readonly _logger: LoggerInterface) {}

  get createSimpleUpdate(): CreateSimpleUpdate {
    const validate = new Validate(
      this.validationRules,
      this.validationOrder,
      this._logger,
    );
    return new CreateSimpleUpdate(validate, this.messageLineSplitter);
  }

  get messageLineSplitter(): MessageLineSplitter {
    if (!this._messageLineSplitter) {
      this._messageLineSplitter = new MessageLineSplitter();
    }

    return this._messageLineSplitter;
  }

  get validationOrder(): ValidationOrder {
    if (!this._validationOrder) {
      this._validationOrder = new ValidationOrder();
    }

    return this._validationOrder;
  }

  get validationRules(): ValidationRules {
    if (!this._validationRules) {
      this._validationRules = new ValidationRules();
    }

    return this._validationRules;
  }
}

export default Context;