import StateDto from "../../../../components/state/StateDto.ts";
import State from "../../../../State.ts";

export default class SetStateDto {
  public run<T>(state: State<T>): StateDto<T> {
    const originatedAt = state.originatedAt
      ? state.originatedAt.toISOString()
      : undefined;
    const updatedAt = state.updatedAt
      ? state.updatedAt.toISOString()
      : undefined;

    const createdAt = state.createdAt.toISOString();

    return new StateDto(state.state, originatedAt, createdAt, updatedAt);
  }
}
