import { LoggerInterface } from "../../src/logger/LoggerInterface.ts";

export class FakeLogger implements LoggerInterface {
  private _loggedMessages: string[] = [];

  debug(message: string, context?: string): void {
    this._loggedMessages.push(`debug: ${message}${context}`);
  }

  error(message: string, context?: string): void {
    this._loggedMessages.push(`error: ${message}${context}`);
  }

  info(message: string, context?: string): void {
    this._loggedMessages.push(`info: ${message}${context}`);
  }

  log(message: string, context?: string): void {
    this._loggedMessages.push(`log: ${message}${context}`);
  }

  warn(message: string, context?: string): void {
    this._loggedMessages.push(`warn: ${message}${context}`);
  }

  get loggedMessages(): string[] {
    return this._loggedMessages;
  }
}
