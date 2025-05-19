import { ExchangeQueue } from "../../../../common/src/adapters/queue/rabbitMq/ExchangeQueue.ts";

export class ProcessActionRequests {
  private _toTcpInterfaceMessage: ExchangeQueue;

  constructor(toTcpInterfaceMessage: ExchangeQueue) {
    this._toTcpInterfaceMessage = toTcpInterfaceMessage;
  }

  public run(): void {
    this._toTcpInterfaceMessage
      .consume()
      .then(() => {});
  }
}
