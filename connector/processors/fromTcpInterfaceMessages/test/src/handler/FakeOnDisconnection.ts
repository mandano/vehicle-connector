import { OnDisconnectionInterface } from "../../../src/handler/OnDisconnectionInterface.ts";

export class FakeOnDisconnection implements OnDisconnectionInterface {
  private _runReturnValue: boolean | undefined;

  constructor(runReturnValue: boolean | undefined) {
    this._runReturnValue = runReturnValue;
  }

  public run(): Promise<boolean | undefined> {
    return Promise.resolve(this._runReturnValue);
  }
}
