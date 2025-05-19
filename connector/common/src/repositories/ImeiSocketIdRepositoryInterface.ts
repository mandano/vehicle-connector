import { Imei } from "../vehicle/components/iot/network/protocol/Imei.ts";

export interface ImeiSocketIdRepositoryInterface {
  delete(imei: Imei): boolean | undefined;
  create(imei: Imei, socketId: string): Map<Imei, string>;
  getSocketId(imei: string): string | undefined;
  getImei(socketId: string): Imei | undefined;
  deleteAll(): void;
}
