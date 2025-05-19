import CreateByMessageLineContextInterface from "../../../../../modules/protocols/common/src/connector/fromVehicle/models/CreateByMessageLineContextInterface.ts";
import CreateMessageLineInterface from "../../../../../modules/protocols/common/src/connector/fromVehicle/CreateInterface.ts";
import CreateByProtocolAndVersionInterface from "../../../../../modules/protocols/common/src/connector/fromVehicle/CreateByProtocolAndVersionInterface.ts";
import BaseContext from "../../../../common/src/context/BaseContext.ts";
import ProtocolsContext from "../../../../../modules/protocols/common/src/_Context.ts";
import TheSimpleProtocol from "../../../../../modules/protocols/theSimpleProtocol/src/_Context.ts";

import ContextInterface from "./ContextInterface.ts";

class Context extends BaseContext implements ContextInterface {
  // remember to only use common protocols references!
  private _protocols: ProtocolsContext | undefined;

  get createModelByMessageLineContext(): CreateByMessageLineContextInterface {
    return this.protocols.connector.fromVehicle.models
      .createByMessageLineContext;
  }

  get createMessageLineContext(): CreateMessageLineInterface {
    return this.protocols.connector.fromVehicle.create;
  }

  get createMessageLineContextByProtocolAndVersion(): CreateByProtocolAndVersionInterface {
    return this.protocols.connector.fromVehicle.createByProtocolAndVersion;
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
