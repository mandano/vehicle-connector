import { Vehicle } from "../../../../../../../connector/common/src/vehicle/Vehicle.ts";

interface CreateMessageLinesInterface {
  run(vehicle: Vehicle): string[] | undefined;
}

export default CreateMessageLinesInterface;
