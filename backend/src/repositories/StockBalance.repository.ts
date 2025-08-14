import type { Model, HydratedDocument } from "mongoose";
import { Types } from "mongoose";
import StockBalanceModel from "../models/StockBalance.model";
import type { IStockBalance, HolderType } from "../models/StockBalance.model";
import { GenericRepository, ReadOptions, WriteOptions, PaginateResult } from "./Generic.repository";

export type StockBalanceDoc = HydratedDocument<IStockBalance>;

export class StockBalanceRepository extends GenericRepository<IStockBalance, StockBalanceDoc> {
  constructor(model: Model<IStockBalance, any, any, any, StockBalanceDoc> = StockBalanceModel as any) {
    super(model);
  }

  async getBalance(
    productId: Types.ObjectId | string,
    holderType: HolderType,
    holderId: Types.ObjectId | string,
    opts?: ReadOptions
  ): Promise<StockBalanceDoc | null> {
    return this.findOne({ product_id: productId, holder_type: holderType, holder_id: holderId }, opts);
  }

  async increment(
    productId: Types.ObjectId | string,
    holderType: HolderType,
    holderId: Types.ObjectId | string,
    by: number,
    opts?: WriteOptions
  ): Promise<StockBalanceDoc | null> {
    return (this as any).model
      .findOneAndUpdate(
        { product_id: productId, holder_type: holderType, holder_id: holderId },
        { $inc: { quantity: by } },
        { upsert: true, new: true, session: opts?.session ?? undefined }
      )
      .exec();
  }

  async listByBranch(branchId: Types.ObjectId | string, opts?: ReadOptions): Promise<StockBalanceDoc[]> {
    return this.findMany({ branch_id: branchId }, opts);
  }

  async paginateByProduct(
    productId: Types.ObjectId | string,
    opts?: ReadOptions & { page?: number; pageSize?: number }
  ): Promise<PaginateResult<StockBalanceDoc>> {
    return this.paginate({ product_id: productId }, { ...opts, sort: opts?.sort ?? { quantity: -1 } });
  }
}

export const stockBalanceRepository = new StockBalanceRepository();
