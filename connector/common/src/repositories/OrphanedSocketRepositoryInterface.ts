import { OrphanedSocket } from "../entities/OrphanedSocket.ts";
import { SocketInterface } from "../../../tcpInterface/src/socket/SocketInterface.ts";

export interface OrphanedSocketRepositoryInterface {
  findById(id: string): OrphanedSocket | undefined;
  create(socket: OrphanedSocket): boolean;
  delete(id: string): boolean;
  deleteAll(): boolean;
  deleteBySocketCount(socketId: string): boolean;
  createBySocket(socket: SocketInterface, socketId: string): boolean;
}
