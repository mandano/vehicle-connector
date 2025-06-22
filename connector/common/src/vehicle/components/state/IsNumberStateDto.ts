import IsStateDto from "./IsStateDto.ts";
import StateDto from "./StateDto.ts";

export default class IsNumberStateDto {
  constructor(private readonly _isStateDto: IsStateDto) {}

  public run(state: unknown): state is StateDto<string> {
    return this._isStateDto.run(state) && typeof state.state === "number";
  }
}
