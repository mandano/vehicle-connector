import { Validate } from "../../../../../../../../../connector/common/src/vehicle/components/iot/network/protocol/messageLineContext/paket/messageLine/validation/Validate.ts";
import { LoggerInterface } from "../../../../../../../../../connector/common/src/logger/LoggerInterface.ts";

import { CreateLock } from "./CreateLock.ts";
import { MessageLineSplitter } from "./MessageLineSplitter.ts";
import { ValidationOrder } from "./validation/ValidationOrder.ts";
import { ValidationRules } from "./validation/ValidationRules.ts";

export class Context {
  private _messageLineSplitter: MessageLineSplitter | undefined;

  private _validationOrder: ValidationOrder | undefined;
  private _validationRules: ValidationRules | undefined;

  constructor(private readonly _logger: LoggerInterface) {}

  get createLock(): CreateLock {
    // TODO: try to reuse BuildFromMessageLine
    const validate = new Validate(
      this.validationRules,
      this.validationOrder,
      this._logger,
    );
    return new CreateLock(validate, this.messageLineSplitter);
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
