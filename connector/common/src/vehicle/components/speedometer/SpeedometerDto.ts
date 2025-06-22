import StateDto from "../state/StateDto.ts";

export default class SpeedometerDto {
  constructor(public state: StateDto<number>) {}
}
