import { CreateMessageLineContext as CreateMessageLineContextTheSimpleProtocol } from "../../../../../theSimpleProtocol/src/simulator/common/fromConnector/CreateMessageLineContext.ts";
import { MessageLineContext } from "../../actions/MessageLineContext.ts";
import { THE_SIMPLE_PROTOCOL } from "../../../../../theSimpleProtocol/src/Protocol.ts";

import { CreateByProtocolAndVersionInterface } from "./CreateByProtocolAndVersionInterface.ts";

export class Create implements CreateByProtocolAndVersionInterface {
  constructor(
    private _createMessageLineContextTheSimpleProtocol: CreateMessageLineContextTheSimpleProtocol,
  ) {}
  public run(
    messageLine: string,
    protocol: string,
    protocolVersion: string,
  ): MessageLineContext | undefined {
    if (protocol === THE_SIMPLE_PROTOCOL) {
      const messageLineContext =
        this._createMessageLineContextTheSimpleProtocol.run(
          protocolVersion,
          messageLine,
        );

      if (messageLineContext !== undefined) {
        return messageLineContext;
      }
      return undefined;
    }

    return undefined;
  }
}
