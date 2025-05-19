import { OnMessageInterfaceV2 } from "../../../src/adapters/queue/OnMessageInterfaceV2.ts";

export class FakeOnMessage implements OnMessageInterfaceV2 {
  private readonly _runReturn: boolean | undefined;
  private _messages: string[] = [];

  constructor(runReturn: boolean | undefined) {
    this._runReturn = runReturn;
  }

  run(
    message: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    options?: { vehicleId?: number },
  ): Promise<boolean | undefined> {
    this._messages.push(message);

    return Promise.resolve(this._runReturn);
  }

  get messages(): string[] {
    return this._messages;
  }
}
