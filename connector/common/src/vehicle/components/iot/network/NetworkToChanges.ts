import StateDtoChanges from "../../state/StateDtoChanges.ts";

import PartialNetworkDto from "./PartialNetworkDto.ts";
import Network from "./Network.ts";
import ConnectionModule from "./ConnectionModule.ts";
import PartialConnectionModuleDto from "./connectionModule/PartialConnectionModuleDto.ts";
import PartialConnectionStateDto from "./connectionModule/connectionState/PartialConnectionStateDto.ts";

// TODO: refactor, use ConnectionModuleToChanges class
export default class NetworkToChanges {
  public run(network: Network): PartialNetworkDto {
    const connectionModules = network.connectionModules.map(
      (connectionModule) =>
        this.connectionModuleToChanges(connectionModule),
    );

    return new PartialNetworkDto(connectionModules);
  }

  private connectionModuleToChanges(
    connectionModule: ConnectionModule,
  ): PartialConnectionModuleDto {
    let partialConnectionStateDto: PartialConnectionStateDto | undefined =
      undefined;
    if (connectionModule.state !== undefined) {
      const partialStateDto = new StateDtoChanges(
        connectionModule.state.state.state,
        connectionModule.state.state.originatedAt?.toISOString(),
        connectionModule.state.state.createdAt.toISOString(),
        connectionModule.state.state.updatedAt?.toISOString(),
      );
      partialConnectionStateDto = new PartialConnectionStateDto(
        partialStateDto,
      );
    }

    let detectedProtocolVersionDto: StateDtoChanges<string> | undefined =
      undefined;
    if (connectionModule.detectedProtocolVersion !== undefined) {
      detectedProtocolVersionDto = new StateDtoChanges(
        connectionModule.detectedProtocolVersion.state,
        connectionModule.detectedProtocolVersion.originatedAt?.toISOString(),
        connectionModule.detectedProtocolVersion.createdAt.toISOString(),
        connectionModule.detectedProtocolVersion.updatedAt?.toISOString(),
      );
    }

    let setProtocolVersionDto: StateDtoChanges<string> | undefined = undefined;
    if (connectionModule.setProtocolVersion !== undefined) {
      setProtocolVersionDto = new StateDtoChanges(
        connectionModule.setProtocolVersion.state,
        connectionModule.setProtocolVersion.originatedAt?.toISOString(),
        connectionModule.setProtocolVersion.createdAt.toISOString(),
        connectionModule.setProtocolVersion.updatedAt?.toISOString(),
      );
    }

    let detectedProtocolDto: StateDtoChanges<string> | undefined = undefined;
    if (connectionModule.detectedProtocol !== undefined) {
      detectedProtocolDto = new StateDtoChanges(
        connectionModule.detectedProtocol.state,
        connectionModule.detectedProtocol.originatedAt?.toISOString(),
        connectionModule.detectedProtocol.createdAt.toISOString(),
        connectionModule.detectedProtocol.updatedAt?.toISOString(),
      );
    }

    let setProtocolDto: StateDtoChanges<string> | undefined = undefined;
    if (connectionModule.setProtocol !== undefined) {
      setProtocolDto = new StateDtoChanges(
        connectionModule.setProtocol.state,
        connectionModule.setProtocol.originatedAt?.toISOString(),
        connectionModule.setProtocol.createdAt.toISOString(),
        connectionModule.setProtocol.updatedAt?.toISOString(),
      );
    }

    return new PartialConnectionModuleDto(
      connectionModule.imei,
      partialConnectionStateDto,
      detectedProtocolVersionDto,
      setProtocolVersionDto,
      detectedProtocolDto,
      setProtocolDto,
    );
  }
}
