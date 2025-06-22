import BatteryDto from "./BatteryDto.ts";

export default class BatteriesDto {
  constructor(public readonly batteries: BatteryDto[] = []) {}
}
