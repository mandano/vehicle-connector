/**
 * Use if you need to know your message processed was successful or not.
 */
export interface OnMessageOnDemandInterface {
  run(
    message: string,
    options?: { vehicleId?: number },
  ): Promise<boolean | undefined>;
}
