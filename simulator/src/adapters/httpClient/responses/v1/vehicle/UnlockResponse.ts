export class UnlockResponse {
  private readonly _message: string;
  private static success: string = "Vehicle unlocked successfully";
  private static missingVehicleId: string = "Missing vehicle id";
  private static vehicleNotFound: string = "Vehicle not found";
  private static notSupportingUnlocking: string = "Vehicle does not support unlocking";
  private static notForwarded: string = "Vehicle could not be unlocked. Unlock request not forwarded.";
  private static unlockFailed: string = "Vehicle could not be unlocked. Response stated failed unlocking";

  constructor(message: string) {
    this._message = message;
  }

  get message(): string {
    return this._message;
  }

  public isSuccess(): boolean {
    return this.message === UnlockResponse.success;
  }

  public isNotSupportingUnlocking(): boolean {
    return this.message === UnlockResponse.notSupportingUnlocking;
  }
}
