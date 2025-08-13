// src/repositories/Product.repository.ts
import type { Model, HydratedDocument, AnyKeys } from "mongoose";
import { Types } from "mongoose";
import ProductModel from "../models/Product.model";
import type { IProduct } from "../models/Product.model";
import { GenericRepository, PaginateResult, ReadOptions, WriteOptions } from "./Generic.repository";

export type ProductDoc = HydratedDocument<IProduct>;

function normSku(sku: string) {
  return sku.trim().toUpperCase();
}
function normCurrency(code: string | undefined) {
  return (code ?? "").trim().toUpperCase();
}

export class ProductRepository extends GenericRepository<IProduct, ProductDoc> {
  constructor(model: Model<IProduct, any, any, any, ProductDoc> = ProductModel as any) {
    super(model);
  }

  /** Find by human product code (product_code) */
  async findByProductCode(productCode: string, opts?: ReadOptions): Promise<ProductDoc | null> {
    return this.findOne({ product_code: productCode }, opts);
  }

  /** Find by SKU within a branch (SKU is uppercased in the model; normalize here too) */
  async findBySkuInBranch(branchId: Types.ObjectId | string, sku: string, opts?: ReadOptions): Promise<ProductDoc | null> {
    return this.findOne({ branch_id: branchId, sku: normSku(sku) }, opts);
  }

  /** List products in a branch */
  async findByBranch(branchId: Types.ObjectId | string, opts?: ReadOptions): Promise<ProductDoc[]> {
    return this.findMany({ branch_id: branchId }, opts);
  }

  /** Search & paginate products in a branch across name/sku/code/description */
  async searchInBranch(
    branchId: Types.ObjectId | string,
    q: string | undefined,
    opts?: ReadOptions & { page?: number; pageSize?: number }
  ): Promise<PaginateResult<ProductDoc>> {
    const filter: any = { branch_id: branchId };
    if (q && q.trim()) {
      const s = q.trim();
      const rx = new RegExp(s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
      filter.$or = [{ name: rx }, { description: rx }, { sku: rx }, { product_code: rx }];
    }
    // default sort newest first; override via opts.sort
    return this.paginate(filter, { ...opts, sort: opts?.sort ?? { createdAt: -1 } });
  }

  /** Activate/deactivate explicitly (soft delete still available via deleteById) */
  async setActive(productId: Types.ObjectId | string, active: boolean, opts?: WriteOptions): Promise<ProductDoc | null> {
    return (this as any).model.findByIdAndUpdate(productId, { $set: { active } }, { new: true, session: opts?.session ?? undefined }).exec();
  }

  /**
   * Update default price (and optionally currency).
   * Your model stores default_price and currency_code (uppercased). Validation lives in the schema.
   */
  async setDefaultPrice(productId: Types.ObjectId | string, price: number, currencyCode?: string, opts?: WriteOptions): Promise<ProductDoc | null> {
    const $set: AnyKeys<IProduct> = { default_price: price } as any;
    if (currencyCode) ($set as any).currency_code = normCurrency(currencyCode);
    return (this as any).model.findByIdAndUpdate(productId, { $set }, { new: true, session: opts?.session ?? undefined }).exec();
  }

  /**
   * Upsert by SKU within a branch.
   * - Normalizes SKU to uppercase
   * - Lets model hooks enforce product_type / flags (track_serialized, returnable, capacity inference, etc.)
   */
  async upsertBySkuInBranch(branchId: Types.ObjectId | string, sku: string, update: AnyKeys<IProduct>, opts?: WriteOptions): Promise<ProductDoc> {
    const filter = { branch_id: branchId, sku: normSku(sku) };
    const toSet: AnyKeys<IProduct> = { ...update, sku: normSku(sku), branch_id: branchId } as any;
    return this.upsert(filter, toSet, opts);
  }

  /** Convenience: list only serialized/returnable products in a branch (useful for assets) */
  async findSerializedInBranch(branchId: Types.ObjectId | string, opts?: ReadOptions): Promise<ProductDoc[]> {
    return this.findMany({ branch_id: branchId, track_serialized: true }, opts);
  }

  /** Convenience: list only active, non-serialized goods/services (for quick order add) */
  async findOrderablesInBranch(branchId: Types.ObjectId | string, opts?: ReadOptions): Promise<ProductDoc[]> {
    return this.findMany({ branch_id: branchId, active: true, product_type: { $in: ["GOOD", "SERVICE"] } }, opts);
  }
}

// Optional singleton
export const productRepository = new ProductRepository();
