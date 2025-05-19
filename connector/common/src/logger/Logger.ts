import { LoggerInterface } from "./LoggerInterface.ts";
import { LogLevels } from "./LogLevels.ts";

export class Logger implements LoggerInterface {
  private readonly level: number;

  constructor(level: number) {
    this.level = level;
  }

  log(message: string, context?: string): void {
    this.logAtLevel(LogLevels.INFO_LEVEL, message, context);
  }

  debug(message: string, context?: string): void {
    this.logAtLevel(LogLevels.DEBUG_LEVEL, message, context);
  }

  info(message: string, context?: string): void {
    this.logAtLevel(LogLevels.INFO_LEVEL, message, context);
  }

  warn(message: string, context?: string): void {
    this.logAtLevel(LogLevels.WARN_LEVEL, message, context);
  }

  error(message: string, context?: string): void {
    this.logAtLevel(LogLevels.ERROR_LEVEL, message, context);
  }

  isLevelEnabled(level: number): boolean {
    return level >= this.level;
  }

  private logAtLevel(level: number, message: string, context?: string): void {
    if (this.isLevelEnabled(level)) {
      const timestamp = new Date().toISOString();

      if (context === undefined) {
        console.log(`${timestamp} ${LogLevels.levels[level]} ${message}`);
      }
      else {
        console.log(`${timestamp} ${LogLevels.levels[level]} ${context} ${message}`);
      }
    }
  }
}

export default Logger;

