import { MessageLineContext } from "../../../../../../connector/common/src/vehicle/components/iot/network/protocol/messageLineContext/MessageLineContext.ts";
import { CreateInterface } from "../../../../theSimpleProtocol/src/connector/common/fromVehicle/messageLineContext/CreateInterface.ts";

export class Create implements CreateInterface {
  constructor(
    private _theSimpleProtocol: CreateInterface,
  ) {}

  public run(messageLine: string): MessageLineContext | undefined {
    return this._theSimpleProtocol.run(messageLine);
  }
}

export default Create;