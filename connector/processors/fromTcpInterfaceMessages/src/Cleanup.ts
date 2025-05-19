import { BaseCleanup } from "../../../common/src/BaseCleanup.ts";
import { LoggerInterface } from "../../../common/src/logger/LoggerInterface.ts";
import { ImeiSocketIdRepositoryInterface } from "../../../common/src/repositories/ImeiSocketIdRepositoryInterface.ts";

export class Cleanup extends BaseCleanup {
  constructor(
    process: NodeJS.Process,
    logger: LoggerInterface,
    private readonly _imeiSocketIdRepository: ImeiSocketIdRepositoryInterface,
  ) {
    super(process, logger);
  }

  public cleanup(): Promise<void> {
    this._logger.log(`Cleaning up...`);

    try {
      this._imeiSocketIdRepository.deleteAll();
    } catch (error) {
      this._logger.error(`Error during cleanup: ${error}`);
      process.exit(1);
    } finally {
      process.exit(0);
    }
  }
}
