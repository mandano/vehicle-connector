import Createv0_1 from "../../../0_1/common/fromVehicle//CreateMessageLineContext.ts";
import { CreateMessageLineContext as v0_2 } from "../../../0_2/common/fromVehicle/CreateMessageLineContext.ts";
import { MessageLineContext } from "../../../../../../../../connector/common/src/vehicle/components/iot/network/protocol/messageLineContext/MessageLineContext.ts";
import { ID_0_1, ID_0_2 } from "../../../../versions.ts";
import { CreatebyProtocolVersionInterface } from "../../../../../../common/src/connector/fromVehicle/CreatebyProtocolVersionInterface.ts";

/**
 * Functionally identical to Create.ts, depending on amount of protocol versions and version number, quicker
 */
export class CreateByProtocolVersion
  implements CreatebyProtocolVersionInterface
{
  constructor(
    private _v0_1: Createv0_1,
    private _v0_2: v0_2,
  ) {}
  public run(
    messageLine: string,
    protocolVersion: string,
  ): MessageLineContext | undefined {
    if (protocolVersion === ID_0_1) {
      return this._v0_1.run(messageLine);
    }

    if (protocolVersion === ID_0_2) {
      return this._v0_2.run(messageLine);
    }

    return undefined;
  }
}
