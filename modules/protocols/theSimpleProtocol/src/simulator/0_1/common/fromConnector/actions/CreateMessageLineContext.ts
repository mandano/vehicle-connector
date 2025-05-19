import { ID_0_1 } from "../../../../../versions.ts";
import { THE_SIMPLE_PROTOCOL } from "../../../../../Protocol.ts";
import { MessageLineContext } from "../../../../../../../common/src/simulator/actions/MessageLineContext.ts";

import { CreatePaket } from "./CreatePaket.ts";

export class CreateMessageLineContext {
  constructor(private _createPaket: CreatePaket) {}

  public run(messageLine: string): MessageLineContext | undefined {
    const paket = this._createPaket.run(messageLine);

    if (paket === undefined) {
      return undefined;
    }

    return new MessageLineContext(
      THE_SIMPLE_PROTOCOL,
      paket,
      ID_0_1,
      paket.trackingId,
    );
  }
}
