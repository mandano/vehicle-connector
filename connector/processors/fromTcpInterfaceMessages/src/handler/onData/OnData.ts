import { TcpInterfaceMessage } from "../../../../../common/src/entities/tcpInterfaceMessage/TcpInterfaceMessage.ts";
import { LoggerInterface } from "../../../../../common/src/logger/LoggerInterface.ts";
import ImeiSocketIdRepositoryInterface from "../../../../../common/src/repositories/imeiSocketId/ImeiSocketIdRepositoryInterface.ts";

import { OnDataInterface } from "./OnDataInterface.ts";
import { HandleFirstPaketInterface } from "./HandleFirstPaketInterface.ts";
import { HandleNotFirstPaketInterface } from "./HandleNotFirstPaketInterface.ts";

export class OnData implements OnDataInterface {
  constructor(
    private readonly _handleFirstPaket: HandleFirstPaketInterface,
    private readonly _handleNotFirstPaket: HandleNotFirstPaketInterface,
    private readonly _logger: LoggerInterface,
    private readonly _imeiSocketIdRepository: ImeiSocketIdRepositoryInterface,
  ) {}

  public async run(tcpInterfaceMessage: TcpInterfaceMessage): Promise<void> {
    if (tcpInterfaceMessage.data === "") {
      this._logger.warn(`Data empty`, OnData.name);

      return;
    }

    const messageLine = tcpInterfaceMessage.data;

    this._logger.debug(`Message: ${messageLine}`, OnData.name);

    const boundImei = await this._imeiSocketIdRepository.getImeiInSocketIdKey(
      tcpInterfaceMessage.socketId,
    );

    if (boundImei === undefined) {
      await this._handleFirstPaket.run(
        messageLine,
        tcpInterfaceMessage.socketId,
      );

      return;
    }

    await this._handleNotFirstPaket.run(
      messageLine,
      boundImei,
      tcpInterfaceMessage.socketId,
    );
  }
}
