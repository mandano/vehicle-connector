import { ValidateInterface } from "../../../../../../../../../connector/common/src/vehicle/components/iot/network/protocol/messageLineContext/paket/messageLine/validation/ValidateInterface.ts";
import { MessageLineSplitterInterface } from "../../../../../../../../../connector/common/src/vehicle/components/iot/network/protocol/messageLineContext/paket/messageLine/MessageLineSplitterInterface.ts";
import { SimpleUpdate } from "../SimpleUpdate.ts";

import CreateSimpleUpdateInterface from "./CreateSimpleUpdateInterface.ts";

export class CreateSimpleUpdate implements CreateSimpleUpdateInterface {
  private _validate: ValidateInterface;
  private _messageLineSplitter: MessageLineSplitterInterface;

  constructor(
    validate: ValidateInterface,
    messageLineSplitter: MessageLineSplitterInterface,
  ) {
    this._validate = validate;
    this._messageLineSplitter = messageLineSplitter;
  }

  public run(messageLine: string): SimpleUpdate | undefined {
    const items = this._messageLineSplitter.run(messageLine);

    if (items === undefined) {
      return undefined;
    }

    if (!this._validate.run(items)) {
      return undefined;
    }

    return new SimpleUpdate(
      Number(items[5]),
      new Date(items[6]),
      Number(items[7]),
      new Date(items[8]),
      items[2],
      items[1],
      new Date(items[4]),
    );
  }
}

export default CreateSimpleUpdate;
