import { MessageLineContext } from "../../../../../common/src/vehicle/components/iot/network/protocol/messageLineContext/MessageLineContext.ts";
import { THE_SIMPLE_PROTOCOL } from "../../../../../../modules/protocols/theSimpleProtocol/src/Protocol.ts";
import { ID_0_1 } from "../../../../../../modules/protocols/theSimpleProtocol/src/versions.ts";
import { CreateUpdateSimpleScooter } from "../../../../../../modules/protocols/theSimpleProtocol/test/connector/0_1/updateSimpleScooter/fromVehicle/CreateUpdateSimpleScooter.ts";

export class CreateMessageLineContext {
  public run(): MessageLineContext {
    const updateSimpleScooter = new CreateUpdateSimpleScooter().run();
    return new MessageLineContext(
      THE_SIMPLE_PROTOCOL,
      updateSimpleScooter,
      ID_0_1,
      updateSimpleScooter.trackingId,
      updateSimpleScooter.imei,
    );
  }
}
