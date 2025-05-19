import { MessageLineContext } from "../../../../../../../../src/vehicle/components/iot/network/protocol/messageLineContext/MessageLineContext.ts";
import {
  CreateByProtocolAndVersionInterface
} from "../../../../../../../../../../modules/protocols/common/src/connector/fromVehicle/CreateByProtocolAndVersionInterface.ts";

export class CreateByProtocolAndVersion implements CreateByProtocolAndVersionInterface {
  private _returnValue: MessageLineContext | undefined;

  constructor(returnValue?: MessageLineContext) {
    this._returnValue = returnValue;
  }

  public setReturnValue(value: MessageLineContext | undefined): void {
    this._returnValue = value;
  }

  public run(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    messageLine: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    protocol: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    protocolVersion: string,
  ): MessageLineContext | undefined {
    return this._returnValue;
  }
}