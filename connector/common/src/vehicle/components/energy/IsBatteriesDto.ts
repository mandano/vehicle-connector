import Batteries from "./Batteries.ts";
import BatteriesDto from "./BatteriesDto.ts";

export default class IsBatteriesDto {
  public static run(batteries: unknown): batteries is BatteriesDto {
    if (typeof batteries !== "object" || batteries === null) {
      return false;
    }

    return (
      "batteries" in batteries &&
      Array.isArray((batteries as Batteries).batteries)
    );
  }
}
