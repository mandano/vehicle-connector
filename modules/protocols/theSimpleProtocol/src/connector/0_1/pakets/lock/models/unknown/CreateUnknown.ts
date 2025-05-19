import { Lock } from "../../Lock.ts";
import { Unknown } from "../../../../../../../../../../connector/common/src/vehicle/model/models/Unknown.ts";
import { FakeSendActionRequest } from "../../../../../../../../../../connector/common/test/vehicle/model/actions/FakeSendActionRequest.ts";

import { NetworkBuilder } from "./NetworkBuilder.ts";
import { Director } from "./Director.ts";
import { IotBuilder } from "./IotBuilder.ts";
import { CreateUnknownInterface } from "./CreateUnknownInterface.ts";
import { LockBuilder } from "./LockBuilder.ts";

export class CreateUnknown implements CreateUnknownInterface {
  public run(paket: Lock): Unknown | undefined {
    const director = new Director(
      new LockBuilder(new FakeSendActionRequest()),
      new IotBuilder(new NetworkBuilder()),
    );

    return director.build(paket);
  }
}
