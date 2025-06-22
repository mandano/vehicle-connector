import StateDto from "../state/StateDto.ts";

export default class BatteryDto {
  constructor(
    public readonly level: StateDto<number>,
    public readonly voltage?: StateDto<number>,
  ) {}
}
