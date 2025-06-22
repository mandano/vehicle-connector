import State from "../../State.ts";

export default class IsState {
  public static run(obj: unknown): obj is State<unknown> {
    return (
      (obj as State<unknown>).state !== undefined &&
      (obj as State<unknown>).state !== null &&
      "updatedAt" in (obj as State<unknown>) &&
      "originatedAt" in (obj as State<unknown>) &&
      "createdAt" in (obj as State<unknown>)
    );
  }
}
