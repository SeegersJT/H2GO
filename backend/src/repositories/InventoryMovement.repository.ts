import type { Model, HydratedDocument } from "mongoose";
import { Types } from "mongoose";
import InventoryMovementModel from "../models/InventoryMovement.nodel";
import type { IInventoryMovement, HolderType } from "../models/InventoryMovement.nodel";
import { GenericRepository, ReadOptions, PaginateResult } from "./Generic.repository";

export type InventoryMovementDoc = HydratedDocument<IInventoryMovement>;

export class InventoryMovementRepository extends GenericRepository<IInventoryMovement, InventoryMovementDoc> {
  constructor(model: Model<IInventoryMovement, any, any, any, InventoryMovementDoc> = InventoryMovementModel as any) {
    super(model);
  }

  async findByMovementNo(movementNo: string, opts?: ReadOptions): Promise<InventoryMovementDoc | null> {
    return this.findOne({ movement_no: movementNo }, opts);
  }

  async findByAsset(assetId: Types.ObjectId | string, opts?: ReadOptions): Promise<InventoryMovementDoc[]> {
    return this.findMany({ asset_id: assetId }, opts);
  }

  async findRecentForHolder(
    holderType: HolderType,
    holderId: Types.ObjectId | string,
    opts?: ReadOptions & { limit?: number }
  ): Promise<InventoryMovementDoc[]> {
    return this.findMany(
      {
        $or: [
          { from_holder_type: holderType, from_holder_id: holderId },
          { to_holder_type: holderType, to_holder_id: holderId },
        ],
      },
      { ...opts, sort: { moved_at: -1 }, projection: opts?.projection, session: opts?.session }
    ).then((docs) => (opts?.limit ? docs.slice(0, opts.limit) : docs));
  }

  /** Paginate movements for a product */
  async paginateForProduct(
    productId: Types.ObjectId | string,
    opts?: ReadOptions & { page?: number; pageSize?: number }
  ): Promise<PaginateResult<InventoryMovementDoc>> {
    return this.paginate({ product_id: productId }, { ...opts, sort: { moved_at: -1 } });
  }
}

export const inventoryMovementRepository = new InventoryMovementRepository();
