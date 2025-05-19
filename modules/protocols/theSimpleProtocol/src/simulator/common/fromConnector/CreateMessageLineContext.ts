import { MessageLineContext } from "../../../../../common/src/simulator/actions/MessageLineContext.ts";
import { ID_0_1, ID_0_2 } from "../../../versions.ts";
import { CreateMessageLineContext as v0_1 } from "../../0_1/common/fromConnector/actions/CreateMessageLineContext.ts";
import { CreateMessageLineContext as v0_2 } from "../../0_2/common/fromConnector/actions/CreateMessageLineContext.ts";

export class CreateMessageLineContext {
  constructor(private readonly _v0_1: v0_1, private readonly _v0_2: v0_2) {}

  public run(protocolVersion: string, messageLine: string): MessageLineContext | undefined {
    if (protocolVersion === ID_0_1) {
      return this._v0_1.run(messageLine);
    }

    if (protocolVersion === ID_0_2) {
      return this._v0_2.run(messageLine);
    }

    return undefined;
  }
}
