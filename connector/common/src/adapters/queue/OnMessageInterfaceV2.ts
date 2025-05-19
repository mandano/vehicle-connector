export interface OnMessageInterfaceV2 {
  run(
    message: string,
    options?: { vehicleId?: number },
  ): Promise<boolean | undefined>;
}

export default OnMessageInterfaceV2;
