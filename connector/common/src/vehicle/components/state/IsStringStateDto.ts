import IsStateDto from "./IsStateDto.ts";
import StateDto from "./StateDto.ts";

export default class IsStringStateDto {
  constructor(private readonly isStateDto: IsStateDto) {}

  public run(state: unknown): state is StateDto<string> {
    return this.isStateDto.run(state) && typeof state.state === "string";
  }
}
