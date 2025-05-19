import Createv0_1 from "../../../0_1/common/fromVehicle/CreateMessageLineContext.ts";
import { CreateMessageLineContext as v0_2 } from "../../../0_2/common/fromVehicle/CreateMessageLineContext.ts";
import { MessageLineContext } from "../../../../../../../../connector/common/src/vehicle/components/iot/network/protocol/messageLineContext/MessageLineContext.ts";

import { CreateInterface } from "./CreateInterface.ts";

export class Create implements CreateInterface {
  constructor(
    private _v0_1: Createv0_1,
    private _v0_2: v0_2,
  ) {}
  public run(messageLine: string): MessageLineContext | undefined {
    const messageLineContext = this._v0_1.run(messageLine);

    if (messageLineContext !== undefined) {
      return messageLineContext;
    }

    return this._v0_2.run(messageLine);
  }
}
