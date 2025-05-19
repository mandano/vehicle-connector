import { OnDataInterface } from "../../../../src/handler/onData/OnDataInterface.ts";
import { TcpInterfaceMessage } from "../../../../../../common/src/entities/tcpInterfaceMessage/TcpInterfaceMessage.ts";

export class FakeOnData implements OnDataInterface {
  private readonly _runReturnValue: boolean;

  constructor(runReturnValue: boolean) {
    this._runReturnValue = runReturnValue;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async run(tcpInterfaceMessage: TcpInterfaceMessage): Promise<void> {

  }
}
