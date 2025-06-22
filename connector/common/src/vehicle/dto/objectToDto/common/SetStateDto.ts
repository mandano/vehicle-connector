import StateDto from "../../../components/state/StateDto.ts";
import IsStateDto from "../../../components/state/IsStateDto.ts";

export default class SetStateDto {
  constructor(private readonly _isStateDto: IsStateDto) {}

  public run<T>(state: unknown): StateDto<T> | undefined {
    if (this._isStateDto.run(state) === false) {
      return undefined;
    }

    const typedState = state as StateDto<T>;

    const originatedAt = typedState.originatedAt
      ? typedState.originatedAt
      : undefined;
    const updatedAt = typedState.updatedAt ? typedState.updatedAt : undefined;

    const createdAt = typedState.createdAt;

    return new StateDto<T>(
      typedState.state,
      originatedAt,
      createdAt,
      updatedAt,
    );
  }
}
