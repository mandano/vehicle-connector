import type Imei from "../../vehicle/components/iot/network/protocol/Imei.ts";

export default interface ImeiSocketIdRepositoryInterface {
  delete(imei: Imei): Promise<boolean | undefined>;
  create(imei: Imei, socketId: string): Promise<boolean>;
  getSocketIdInImeiKey(imei: string): Promise<string | undefined>;
  getImeiInSocketIdKey(socketId: string): Promise<Imei | undefined>;
  deleteAll(): Promise<boolean>;
  deleteBySocketId(socketId: string): Promise<boolean | undefined>;
  // getAll(): Promise<Map<Imei, string>>;
  getCount(): Promise<number | undefined>;
}