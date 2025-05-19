export class ModelNameResponse {
  private readonly _message: string;
  private static success: string = "Model name updated successfully";
  private static missingVehicleId: string = "Missing vehicle id";
  private static missingModelName: string = "Missing model name";
  private static invalidModelName: string = "Invalid model name";
  private static vehicleNotFound: string = "Vehicle not found";

  constructor(message: string) {
    this._message = message;
  }

  get message(): string {
    return this._message;
  }

  public isSuccess(): boolean {
    return this._message === ModelNameResponse.success;
  }
}
