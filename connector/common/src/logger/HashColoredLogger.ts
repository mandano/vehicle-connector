import { LogLevels } from "./LogLevels.ts";
import {HashColoredLoggerInterface} from "./HashColoredLoggerInterface.ts";

export class HashColoredLogger implements HashColoredLoggerInterface {
  private readonly level: number;

  constructor(level: number) {
    this.level = level;
  }

  log(message: string, colorHash: string, context?: string): void {
    this.logAtLevel(LogLevels.INFO_LEVEL, message, colorHash, context);
  }

  debug(message: string, colorHash: string, context?: string): void {
    this.logAtLevel(LogLevels.DEBUG_LEVEL, message, colorHash, context);
  }

  info(message: string, colorHash: string, context?: string): void {
    this.logAtLevel(LogLevels.INFO_LEVEL, message, colorHash, context);
  }

  warn(message: string, colorHash: string, context?: string): void {
    this.logAtLevel(LogLevels.WARN_LEVEL, message, colorHash, context);
  }

  error(message: string, colorHash: string, context?: string): void {
    this.logAtLevel(LogLevels.ERROR_LEVEL, message, colorHash, context);
  }

  isLevelEnabled(level: number): boolean {
    return level >= this.level;
  }

  private logAtLevel(level: number, message: string, colorHash: string, context?: string): void {
    const colors = this.generateColor(colorHash);

    if (this.isLevelEnabled(level)) {
      const timestamp = new Date().toISOString();

      if (context === undefined) {
        console.log(`${timestamp} ${LogLevels.levels[level]} ${message}`);
      }
      else {
        console.log(`${timestamp} ${LogLevels.levels[level]} ${context} ${message} ${colors.background}${colors.foreground}${colorHash}\x1b[0m`);
      }
    }
  }

  private generateColor(input: string): { foreground: string; background: string } {
    let hash = 0;
    for (let i = 0; i < input.length; i++) {
      hash = input.charCodeAt(i) + ((hash << 5) - hash);
    }
    const r = (hash >> 16) & 0xff;
    const g = (hash >> 8) & 0xff;
    const b = hash & 0xff;

    // Create complementary colors for foreground and background
    const complement = (x: number) => 255 - x;
    return {
      foreground: `\x1b[38;2;${r};${g};${b}m`,
      background: `\x1b[48;2;${complement(r)};${complement(g)};${complement(b)}m`,
    };
  }
}

export default HashColoredLogger;

