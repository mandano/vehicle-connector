import { THE_SIMPLE_PROTOCOL } from "../../../../Protocol.ts";
import MessageLineContext from "../../../../../../../../connector/common/src/vehicle/components/iot/network/protocol/messageLineContext/MessageLineContext.ts";
import CreateSimpleUpdate from "../../pakets/simpleUpdate/fromVehicle/CreateSimpleUpdate.ts";
import CreateLock from "../../pakets/lock/fromVehicle/CreateLock.ts";

export default class Create {
  constructor(
    private _createSimpleUpdate: CreateSimpleUpdate,
    private _createLock: CreateLock,
  ) {}

  public run(messageLine: string): MessageLineContext | undefined {
    const simpleUpdate = this._createSimpleUpdate.run(messageLine);

    if (simpleUpdate !== undefined) {
      return new MessageLineContext(
        THE_SIMPLE_PROTOCOL,
        simpleUpdate,
        simpleUpdate.protocolVersion,
        simpleUpdate.trackingId,
        simpleUpdate.imei,
      );
    }

    const lock = this._createLock.run(messageLine);

    if (lock !== undefined) {
      return new MessageLineContext(
        THE_SIMPLE_PROTOCOL,
        lock,
        lock.protocolVersion,
        lock.trackingId,
        lock.imei,
      );
    }

    return undefined;
  }
}
