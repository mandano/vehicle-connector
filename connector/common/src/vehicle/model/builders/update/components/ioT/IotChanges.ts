import PositionChanges from "../position/PositionChanges.ts";
import PartialNetworkDto from "../../../../../components/iot/network/PartialNetworkDto.ts";

export default class IotChanges {
  constructor(
    public position: PositionChanges | undefined = undefined,
    public network: PartialNetworkDto | undefined = undefined,
  ) {}
}
