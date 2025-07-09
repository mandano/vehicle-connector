import SocketInterface from "tcpinterface/src/socket/SocketInterface.ts";

import OrphanedSocket from "../../entities/OrphanedSocket.ts";

export default interface OrphanedSocketRepositoryInterface {
  findById(id: string): Promise<OrphanedSocket | undefined>;
  create(socket: OrphanedSocket): Promise<boolean>;
  delete(id: string): Promise<boolean>;
  deleteAll(): Promise<boolean>;
  deleteBySocketId(socketId: string): Promise<boolean>;
  createBySocket(
    socket: SocketInterface,
    socketId: string,
    appName: string,
  ): Promise<boolean>;
  getAll(): Promise<OrphanedSocket[] | undefined>;
}
