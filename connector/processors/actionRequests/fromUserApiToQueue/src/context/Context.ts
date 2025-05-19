import CreateMessageLineInterface from "../../../../../../modules/protocols/common/src/connector/toVehicle/actions/lock/CreateMessageLineInterface.ts";
import ProtocolsContext from "../../../../../../modules/protocols/common/src/_Context.ts";
import TheSimpleProtocol from "../../../../../../modules/protocols/theSimpleProtocol/src/_Context.ts";
import RabbitMqConfig from "../../../../../common/src/adapters/queue/rabbitMq/Config.ts";
import BaseContext from "../../../../../common/src/context/BaseContext.ts";

import ContextInterface from "./ContextInterface.ts";

class Context extends BaseContext implements ContextInterface {
  // remember to only use common protocols references!
  private _protocols: ProtocolsContext | undefined;

  constructor(rabbitMqConfig: RabbitMqConfig) {
    super(rabbitMqConfig);
  }

  get createMessageLine(): CreateMessageLineInterface {
    return this.protocols.connector.toVehicle.actions.lock.createMessageLine;
  }

  get protocols(): ProtocolsContext {
    if (!this._protocols) {
      this._protocols = new ProtocolsContext(
        new TheSimpleProtocol(this.logger),
      );
    }

    return this._protocols;
  }
}

export default Context;
