import { ImeiSocketIdRepositoryInterface } from "../../src/repositories/ImeiSocketIdRepositoryInterface.ts";
import { Imei } from "../../src/vehicle/components/iot/network/protocol/Imei.ts";

export class FakeImeiSocketIdFileRepository
  implements ImeiSocketIdRepositoryInterface
{
  private readonly _imeiSocketIds: Map<Imei, string> = new Map();
  private readonly _createReturnValue: Map<Imei, string> = new Map();
  private readonly _deleteReturnValue: boolean | undefined = false;
  private readonly _deleteBySocketIdReturnValue: boolean | undefined = false;
  private readonly _getImeiReturnValue: Imei | undefined = undefined;
  private readonly _getSocketIdReturnValue: string | undefined = undefined;
  private readonly _getAllReturnValue: Map<Imei, string> | undefined =
    new Map();

  constructor(options?: {
    createReturnValue?: Map<Imei, string>;
    deleteReturnValue?: boolean | undefined;
    deleteBySocketIdReturnValue?: boolean | undefined;
    getImeiReturnValue?: Imei | undefined;
    getSocketIdReturnValue?: string | undefined;
    getAllReturnValue?: Map<Imei, string> | undefined;
    existingImeiSocketIds?: Map<Imei, string>;
  }) {
    if (options === undefined) {
      return;
    }

    this._createReturnValue =
      options["createReturnValue"] || this._createReturnValue;
    this._deleteReturnValue =
      options["deleteReturnValue"] || this._deleteReturnValue;
    this._deleteBySocketIdReturnValue =
      options["deleteBySocketIdReturnValue"] ||
      this._deleteBySocketIdReturnValue;
    this._getImeiReturnValue =
      options["getImeiReturnValue"] || this._getImeiReturnValue;
    this._getSocketIdReturnValue =
      options["getSocketIdReturnValue"] || this._getSocketIdReturnValue;
    this._getAllReturnValue =
      options["getAllReturnValue"] || this._getAllReturnValue;
    this._imeiSocketIds = options["existingImeiSocketIds"] ?? this._imeiSocketIds;
  }

  create(imei: Imei, socketId: string): Map<Imei, string> {
    this._imeiSocketIds.set(imei, socketId);

    return this._createReturnValue;
  }

  delete(imei: Imei): boolean | undefined {
    this._imeiSocketIds.delete(imei);

    return this._deleteReturnValue;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  deleteBySocketId(socketId: string): boolean | undefined {
    return this._deleteBySocketIdReturnValue;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getImei(socketId: string): Imei | undefined {
    return this._getImeiReturnValue;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getSocketId(imei: string): string | undefined {
    return this._getSocketIdReturnValue;
  }

  public getAll(): Map<Imei, string> | undefined {
    return this._getAllReturnValue;
  }

  public deleteAll(): void {
    return;
  }

  get imeiSocketIds(): Map<Imei, string> {
    return this._imeiSocketIds;
  }
}
