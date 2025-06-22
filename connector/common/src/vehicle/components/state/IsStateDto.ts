import StateDto from "./StateDto.ts";

export default class IsStateDto {
  public run(obj: unknown): obj is StateDto<unknown> {
    const set =
      (obj as StateDto<unknown>).state !== undefined &&
      (obj as StateDto<unknown>).state !== null;

    if (
      "updatedAt" in (obj as StateDto<unknown>) &&
      typeof (obj as StateDto<unknown>).updatedAt !== "string"
    ) {
      return false;
    }

    if (
      "originatedAt" in (obj as StateDto<unknown>) &&
      typeof (obj as StateDto<unknown>).originatedAt !== "string"
    ) {
      return false;
    }

    return (
      set &&
      "createdAt" in (obj as StateDto<unknown>) &&
      typeof (obj as StateDto<unknown>).createdAt === "string"
    );
  }
}
