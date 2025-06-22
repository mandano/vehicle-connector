import Hashable from "../Hashable.ts";

export default class IsHashable {
  public static run(data: unknown): data is Hashable<unknown> {
    if (typeof data !== "object" || data === null) {
      return false;
    }

    const hashableCandidate = data as Hashable<unknown>;

    return (
      hashableCandidate.hash !== undefined &&
      hashableCandidate.value !== undefined &&
      typeof hashableCandidate.hash === "string"
    );
  }
}