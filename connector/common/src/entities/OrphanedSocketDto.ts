export default class OrphanedSocketDto {
  constructor(
    public id: string,
    public ip: string,
    public applicationName: string,
    public createdAt: Date,
  ) {}
}
