import { SocketInterface } from "../../SocketInterface.ts";

export interface OnConnectionInterface {
  run(socket: SocketInterface): Promise<void>;
}
