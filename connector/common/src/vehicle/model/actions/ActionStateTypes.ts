export type TypeSupportedActionStateTypes =
  | typeof ActionStateTypes.LOCK
  | typeof ActionStateTypes.UNLOCK
  | typeof ActionStateTypes.SPEED_ADJUSTMENT;

export class ActionStateTypes {
  public static LOCK = "LOCK";
  public static UNLOCK = "UNLOCK";
  public static SPEED_ADJUSTMENT = "SPEED_ADJUSTMENT";

  public static SUPPORTED_TYPES = [
    ActionStateTypes.LOCK,
    ActionStateTypes.UNLOCK,
    ActionStateTypes.SPEED_ADJUSTMENT,
  ];
}
