import NetworkDto from "./network/NetworkDto.ts";
import PositionDto from "./position/PositionDto.ts";

export default class IotDto {
  constructor(
    public readonly network?: NetworkDto,
    public readonly position?: PositionDto,
  ) {}
}
