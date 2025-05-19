import { SocketInterface } from "../../SocketInterface.ts";

export interface OnDataInterface {
  run(socket: SocketInterface, data: Buffer): Promise<void>;
}
