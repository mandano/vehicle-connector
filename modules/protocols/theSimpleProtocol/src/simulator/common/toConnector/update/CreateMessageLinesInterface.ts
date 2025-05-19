import { Vehicle } from "../../../../../../../../connector/common/src/vehicle/Vehicle.ts";

export interface CreateMessageLinesByProtocolVersionInterface {
  run(protocolVersion: string, vehicle: Vehicle): string[] | undefined;
}

export default CreateMessageLinesByProtocolVersionInterface;
