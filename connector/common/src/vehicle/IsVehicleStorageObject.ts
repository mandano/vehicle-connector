import VehicleStorageObject from "./VehicleStorageObject.ts";

export default class IsVehicleStorageObject {
  public static run(
    obj: unknown,
  ): obj is VehicleStorageObject {
    if (typeof obj !== "object" || obj === null) {
      return false;
    }

    const candidate = obj as Record<string, unknown>;

    if (typeof candidate.id !== "number") {
      return false;
    }

    if (typeof candidate.model !== "object" || candidate.model === null) {
      return false;
    }

    const model = candidate.model as Record<string, unknown>;

    // TODO: test for actual modelNames
    if (typeof model.modelName !== "string") {
      return false;
    }

    if (
      !(candidate.createdAt instanceof Date) &&
      typeof candidate.createdAt !== "string"
    ) {
      return false;
    }

    return true;
  }
}
