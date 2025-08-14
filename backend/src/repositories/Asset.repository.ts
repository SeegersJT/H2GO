import type { Model, HydratedDocument } from "mongoose";
import { Types } from "mongoose";
import AssetModel from "../models/Asset.model";
import type { IAsset, HolderType } from "../models/Asset.model";
import { GenericRepository, ReadOptions, WriteOptions, PaginateResult } from "./Generic.repository";

export type AssetDoc = HydratedDocument<IAsset>;

export class AssetRepository extends GenericRepository<IAsset, AssetDoc> {
  constructor(model: Model<IAsset, any, any, any, AssetDoc> = AssetModel as any) {
    super(model);
  }

  /** Find by human asset number */
  async findByAssetNo(assetNo: string, opts?: ReadOptions): Promise<AssetDoc | null> {
    return this.findOne({ asset_no: assetNo }, opts);
  }

  /** Find by product and serial number */
  async findBySerial(productId: Types.ObjectId | string, serial: string, opts?: ReadOptions): Promise<AssetDoc | null> {
    return this.findOne({ product_id: productId, serial_no: serial.trim().toUpperCase() }, opts);
  }

  /** List assets held by a specific holder */
  async findByHolder(holderType: HolderType, holderId: Types.ObjectId | string, opts?: ReadOptions): Promise<AssetDoc[]> {
    return this.findMany({ current_holder_type: holderType, current_holder_id: holderId }, opts);
  }

  /** Search assets within a branch by asset number or serial */
  async searchInBranch(
    branchId: Types.ObjectId | string,
    q: string | undefined,
    opts?: ReadOptions & { page?: number; pageSize?: number }
  ): Promise<PaginateResult<AssetDoc>> {
    const filter: any = { branch_id: branchId };
    if (q && q.trim()) {
      const s = q.trim();
      const rx = new RegExp(s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
      filter.$or = [{ asset_no: rx }, { serial_no: rx }];
    }
    return this.paginate(filter, { ...opts, sort: opts?.sort ?? { createdAt: -1 } });
  }

  /** Update holder/state info */
  async updateHolder(
    assetId: Types.ObjectId | string,
    holderType: HolderType,
    holderId: Types.ObjectId | string,
    state: string | undefined,
    movedAt: Date = new Date(),
    opts?: WriteOptions
  ): Promise<AssetDoc | null> {
    const update: any = {
      current_holder_type: holderType,
      current_holder_id: holderId,
      last_movement_at: movedAt,
    };
    if (state) update.asset_state = state;
    return (this as any).model.findByIdAndUpdate(assetId, { $set: update }, { new: true, session: opts?.session ?? undefined }).exec();
  }
}

export const assetRepository = new AssetRepository();
