import { BaseCleanup } from "../../common/src/BaseCleanup.ts";
import { LoggerInterface } from "../../common/src/logger/LoggerInterface.ts";
import { OrphanedSocketFileSystemRepository } from "../../common/src/repositories/OrphanedSocketFileSystemRepository.ts";

import { Sockets } from "./socket/Sockets.ts";
import { OnDisconnectionInterface } from "./socket/from/onEventsHandler/OnDisconnectionInterface.ts";

export class Cleanup extends BaseCleanup {
  constructor(
    process: NodeJS.Process,
    logger: LoggerInterface,
    private readonly _orphanedSocketRepository: OrphanedSocketFileSystemRepository,
    private readonly _sockets: Sockets,
    private readonly _onDisconnection: OnDisconnectionInterface,
  ) {
    super(process, logger);
  }

  public async cleanup(): Promise<void> {
    this._logger.log(`Cleaning up...`);

    for (const [socketId] of this._sockets.sockets) {
      await this._onDisconnection.run(socketId);
    }

    try {
      this._orphanedSocketRepository.deleteAll();
    } catch (error) {
      this._logger.error(`Error during cleanup: ${error}`);
      process.exit(1);
    } finally {
      process.exit(0);
    }
  }
}
