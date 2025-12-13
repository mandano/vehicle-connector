import StateDto from "../../../../../components/state/StateDto.ts";

export default class PositionChanges {
  constructor(
    public latitude: Partial<StateDto<number>> | undefined = undefined,
    public longitude: Partial<StateDto<number>> | undefined = undefined,
    public accuracy: Partial<StateDto<number>> | undefined = undefined,
  ) {}
}
