import BaseCreateMessageLine from "../../../../0_1/pakets/lock/toVehicle/CreateMessageLine.ts";
import { ID_0_2 } from "../../../../../versions.ts";

class CreateMessageLine extends BaseCreateMessageLine {
  protected protocolVersion = ID_0_2;
}

export default CreateMessageLine;
