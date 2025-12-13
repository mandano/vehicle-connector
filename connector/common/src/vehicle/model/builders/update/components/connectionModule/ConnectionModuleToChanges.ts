import ConnectionModule from "../../../../../components/iot/network/ConnectionModule.ts";
import PartialConnectionModuleDto from "../../../../../components/iot/network/connectionModule/PartialConnectionModuleDto.ts";
import StateDtoChanges from "../../../../../components/state/StateDtoChanges.ts";
import State from "../../../../../State.ts";
import PartialConnectionStateDto from "../../../../../components/iot/network/connectionModule/connectionState/PartialConnectionStateDto.ts";

export default class ConnectionModuleToChanges {
  public run(connectionModule: ConnectionModule): PartialConnectionModuleDto {
    const partialConnectionModuleDto = new PartialConnectionModuleDto(
      connectionModule.imei,
    );

    if (connectionModule.state?.state !== undefined) {
      const partialStateDto = this.setPartialStateDto(
        connectionModule.state.state,
      );

      if (
        partialStateDto !== undefined &&
        partialStateDto.state !== undefined
      ) {
        partialConnectionModuleDto.state = new PartialConnectionStateDto(
          partialStateDto,
        );
      }
    }

    if (connectionModule.detectedProtocolVersion !== undefined) {
      partialConnectionModuleDto.detectedProtocolVersion =
        this.setPartialStateDto(connectionModule.detectedProtocolVersion);
    }

    if (connectionModule.setProtocolVersion !== undefined) {
      partialConnectionModuleDto.setProtocolVersion = this.setPartialStateDto(
        connectionModule.setProtocolVersion,
      );
    }

    if (connectionModule.detectedProtocol !== undefined) {
      partialConnectionModuleDto.detectedProtocol = this.setPartialStateDto(
        connectionModule.detectedProtocol,
      );
    }

    if (connectionModule.setProtocol !== undefined) {
      partialConnectionModuleDto.setProtocol = this.setPartialStateDto(
        connectionModule.setProtocol,
      );
    }

    return partialConnectionModuleDto;
  }

  private setPartialStateDto<T>(state: State<T>): StateDtoChanges<T> {
    const partialStateDto = new StateDtoChanges<T>();
    if (state.state !== undefined) {
      partialStateDto.state = state.state;
    }
    if (state.originatedAt !== undefined) {
      partialStateDto.originatedAt = state.originatedAt.toISOString();
    }
    if (state.updatedAt !== undefined) {
      partialStateDto.updatedAt = state.updatedAt.toISOString();
    }
    if (state.createdAt !== undefined) {
      partialStateDto.createdAt = state.createdAt.toISOString();
    }

    return partialStateDto;
  }
}
