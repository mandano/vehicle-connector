export class OrphanedSocket {
  id: string;
  ip: string;
  createdAt: Date;

  constructor(id: string, ip: string, createdAt: Date) {
    this.id = id;
    this.ip = ip;
    this.createdAt = createdAt;
  }
}
