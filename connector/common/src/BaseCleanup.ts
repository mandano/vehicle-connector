import { LoggerInterface } from "./logger/LoggerInterface.ts";

export abstract class BaseCleanup {
  private static SIGINT = "SIGINT";
  private static SIGTERM = "SIGTERM";
  private static UNHANDLED_REJECTION = "unhandledRejection";
  private signalsListeningTo = [
    BaseCleanup.SIGINT,
    BaseCleanup.SIGTERM,
    BaseCleanup.UNHANDLED_REJECTION,
  ];

  protected constructor(
    protected _process: NodeJS.Process,
    protected _logger: LoggerInterface,
  ) {}

  public abstract cleanup(): Promise<void>;

  public init(): void {
    this.signalsListeningTo.forEach((signal) => {
      this._process.on(signal, async () => {
        this._process.stdout.write("\n");
        await this.cleanup();
        this._process.exit(0);
      });
    });
  }
}
