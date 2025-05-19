import { HashColoredLoggerInterface } from "../../src/logger/HashColoredLoggerInterface.ts";

export class FakeHashColoredLogger implements HashColoredLoggerInterface {
  private _loggedMessages: string[] = [];

  debug(message: string, colorHash: string, context?: string): void {
    this._loggedMessages.push(`debug: ${message}${context}`);
  }

  error(message: string, colorHash: string, context?: string): void {
    this._loggedMessages.push(`error: ${message}${context}`);
  }

  info(message: string, colorHash: string, context?: string): void {
    this._loggedMessages.push(`info: ${message}${context}`);
  }

  log(message: string, colorHash: string, context?: string): void {
    this._loggedMessages.push(`log: ${message}${context}`);
  }

  warn(message: string, colorHash: string, context?: string): void {
    this._loggedMessages.push(`warn: ${message}${context}`);
  }

  get loggedMessages(): string[] {
    return this._loggedMessages;
  }
}
