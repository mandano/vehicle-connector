import StateDto from "../../state/StateDto.ts";

export default class PositionDto {
  constructor(
    public readonly latitude: StateDto<number>,
    public readonly longitude: StateDto<number>,
    public readonly createdAt: Date,
    public readonly accuracy?: StateDto<number>,
  ) {}
}
