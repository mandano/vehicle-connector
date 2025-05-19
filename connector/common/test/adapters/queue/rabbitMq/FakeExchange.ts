import { ExchangeInterface } from "../../../../src/adapters/queue/ExchangeInterface.ts";

export class FakeExchange implements ExchangeInterface {
  private readonly _publishReturnValue: boolean;

  constructor(publishReturnValue: boolean = true) {
    this._publishReturnValue = publishReturnValue;
  }

  public async init(): Promise<boolean> {
    return true;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async publish(message: string): Promise<boolean | undefined> {
    return this._publishReturnValue;
  }
}
