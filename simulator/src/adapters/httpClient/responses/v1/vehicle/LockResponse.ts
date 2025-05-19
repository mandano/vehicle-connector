export class LockResponse {
  private readonly _message: string;
  private static success: string = "Vehicle locked successfully";
  private static missingVehicleId: string = "Missing vehicle id";
  private static vehicleNotFound: string = "Vehicle not found";
  private static notSupportingLocking: string = "Vehicle does not support locking";
  private static notForwarded: string = "Vehicle could not be locked. Lock request not forwarded.";
  private static lockFailed: string = "Vehicle could not be locked. Lock failed.";

  constructor(message: string) {
    this._message = message;
  }

  get message(): string {
    return this._message;
  }

  public isSuccess(): boolean {
    return this._message === LockResponse.success;
  }

  public isNotSupportingLocking(): boolean {
    return this._message === LockResponse.notSupportingLocking;
  }
}
