import VehicleDto from "./VehicleDto.ts";

export default class IsVehicleDto {
  public static run(obj: unknown): obj is VehicleDto {
    return (
      typeof obj === "object" &&
      obj !== null &&
      (obj as VehicleDto).id !== undefined &&
      (obj as VehicleDto).model !== undefined &&
      (obj as VehicleDto).createdAt !== undefined
    );
  }
}
