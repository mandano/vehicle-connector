import { Context as LockableScooterContext } from "./lockableScooter/_Context.ts";
import ToMessageLine from "./ToMessageLine.ts";
import ContextToConnector from "./toConnector/_Context.ts";

export class Context {
  private _lockableScooterContext: LockableScooterContext | undefined;
  private _createMessageLine: ToMessageLine | undefined;
  private _toConnector: ContextToConnector | undefined;

  get lockableScooter(): LockableScooterContext {
    if (!this._lockableScooterContext) {
      this._lockableScooterContext = new LockableScooterContext(
        this.toConnector.createMessageLine,
      );
    }

    return this._lockableScooterContext;
  }

  get createMessageLine(): ToMessageLine {
    if (!this._createMessageLine) {
      this._createMessageLine = new ToMessageLine(
        this.lockableScooter.toMessageLine,
      );
    }

    return this._createMessageLine;
  }

  get toConnector(): ContextToConnector {
    if (!this._toConnector) {
      this._toConnector = new ContextToConnector();
    }

    return this._toConnector;
  }
}

export default Context;
