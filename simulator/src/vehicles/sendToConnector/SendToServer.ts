import { TcpClient } from "../../adapters/TcpClient.ts";
import { HashColoredLoggerInterface } from "../../../../connector/common/src/logger/HashColoredLoggerInterface.ts";
import { LoggerInterface } from "../../../../connector/common/src/logger/LoggerInterface.ts";

export class SendToServer {
  private _tcpClient: TcpClient;
  private _hashColoredLogger: HashColoredLoggerInterface;

  constructor(
    tcpClient: TcpClient,
    hashColoredLogger: HashColoredLoggerInterface,
    private _logger: LoggerInterface,
  ) {
    this._tcpClient = tcpClient;
    this._hashColoredLogger = hashColoredLogger;
  }

  public async run(messageLine: string, trackingId?: string): Promise<boolean> {
    const connected = await this._tcpClient.connect();

    if (connected === false) {
      return false;
    }

    if (trackingId === undefined) {
      this._logger.debug(
        `Sending to connector: ${messageLine}`,
        SendToServer.name,
      );
    } else {
      this._hashColoredLogger.debug(
        `Sending to connector: ${messageLine}`,
        trackingId,
        SendToServer.name,
      );
    }

    return this._tcpClient.sendMessage(messageLine);
  }
}
