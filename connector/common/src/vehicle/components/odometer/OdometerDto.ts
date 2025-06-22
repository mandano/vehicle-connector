import StateDto from "../state/StateDto.ts";

export default class OdometerDto {
  constructor(public state: StateDto<number>) {}
}
