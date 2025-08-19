import type { Model, HydratedDocument, AnyKeys } from "mongoose";
import { Types } from "mongoose";
import PriceListModel from "../models/PriceList.model";
import type { IPriceList } from "../models/PriceList.model";
import { GenericRepository, PaginateResult, ReadOptions, WriteOptions } from "./Generic.repository";

export type PriceListDoc = HydratedDocument<IPriceList>;

function normCurrency(code?: string) {
  return (code ?? "").trim().toUpperCase();
}
function isWithin(date: Date, from?: Date | null, to?: Date | null) {
  const t = date.getTime();
  if (from && t < new Date(from).getTime()) return false;
  if (to && t > new Date(to).getTime()) return false;
  return true;
}

export class PriceListRepository extends GenericRepository<IPriceList, PriceListDoc> {
  constructor(model: Model<IPriceList, any, any, any, PriceListDoc> = PriceListModel as any) {
    super(model);
  }

  /** Find by human code */
  async findByPriceListNo(priceListNo: string, opts?: ReadOptions): Promise<PriceListDoc | null> {
    return this.findOne({ price_list_no: priceListNo }, opts);
  }

  /** Lists for a branch (optionally only active/valid on date) */
  async findByBranch(branchId: Types.ObjectId | string, opts?: ReadOptions & { onDate?: Date }): Promise<PriceListDoc[]> {
    const filter: any = { branch_id: branchId };
    const lists = await this.findMany(filter, { ...opts, sort: { priority: -1, createdAt: -1 } });
    if (!opts?.onDate) return lists;
    return lists.filter((pl) => isWithin(opts.onDate!, pl.valid_from ?? undefined, pl.valid_to ?? undefined));
  }

  /** User‑specific lists (most specific first) */
  async findForUser(userId: Types.ObjectId | string, opts?: ReadOptions & { onDate?: Date }): Promise<PriceListDoc[]> {
    const filter: any = { user_id: userId };
    const lists = await this.findMany(filter, { ...opts, sort: { priority: -1, createdAt: -1 } });
    if (!opts?.onDate) return lists;
    return lists.filter((pl) => isWithin(opts.onDate!, pl.valid_from ?? undefined, pl.valid_to ?? undefined));
  }

  /** Branch default (active + is_default) */
  async findDefaultForBranch(branchId: Types.ObjectId | string, opts?: ReadOptions): Promise<PriceListDoc | null> {
    return this.findOne({ branch_id: branchId, is_default: true }, { ...opts, sort: { priority: -1, createdAt: -1 } });
  }

  /** Search & paginate by name/code within a branch */
  async searchInBranch(
    branchId: Types.ObjectId | string,
    q: string | undefined,
    opts?: ReadOptions & { page?: number; pageSize?: number }
  ): Promise<PaginateResult<PriceListDoc>> {
    const filter: any = { branch_id: branchId };
    if (q && q.trim()) {
      const s = q.trim();
      const rx = new RegExp(s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
      filter.$or = [{ name: rx }, { price_list_no: rx }];
    }
    return this.paginate(filter, { ...opts, sort: opts?.sort ?? { priority: -1, createdAt: -1 } });
  }

  /** Activate/deactivate */
  async setActive(priceListId: Types.ObjectId | string, active: boolean, opts?: WriteOptions): Promise<PriceListDoc | null> {
    return (this as any).model.findByIdAndUpdate(priceListId, { $set: { active } }, { new: true, session: opts?.session ?? undefined }).exec();
  }

  /** Set default for branch: flips others off */
  async setDefault(priceListId: Types.ObjectId | string, branchId: Types.ObjectId | string, opts?: WriteOptions): Promise<void> {
    const session = opts?.session ?? undefined;
    await (this as any).model.updateMany({ branch_id: branchId, _id: { $ne: priceListId } }, { $set: { is_default: false } }, { session }).exec();
    await (this as any).model.findByIdAndUpdate(priceListId, { $set: { is_default: true } }, { session }).exec();
  }

  /** Set priority (higher means more preferred) */
  async setPriority(priceListId: Types.ObjectId | string, priority: number, opts?: WriteOptions): Promise<PriceListDoc | null> {
    return (this as any).model.findByIdAndUpdate(priceListId, { $set: { priority } }, { new: true, session: opts?.session ?? undefined }).exec();
  }

  /** Set validity window */
  async setValidity(
    priceListId: Types.ObjectId | string,
    validFrom: Date | null | undefined,
    validTo: Date | null | undefined,
    opts?: WriteOptions
  ): Promise<PriceListDoc | null> {
    const $set: AnyKeys<IPriceList> = {} as any;
    ($set as any).valid_from = validFrom ?? null;
    ($set as any).valid_to = validTo ?? null;
    return (this as any).model.findByIdAndUpdate(priceListId, { $set }, { new: true, session: opts?.session ?? undefined }).exec();
  }

  /** Upsert or update a single price item in `items` array (by product_id + min_qty) */
  async upsertItem(
    priceListId: Types.ObjectId | string,
    productId: Types.ObjectId | string,
    unitPrice: number,
    minQty: number = 1,
    currencyCode?: string,
    billingPeriod: "per_delivery" | "monthly" = "per_delivery",
    opts?: WriteOptions
  ): Promise<PriceListDoc | null> {
    const session = opts?.session ?? undefined;

    // Try exact match update first
    const updated = await (this as any).model
      .findOneAndUpdate(
        { _id: priceListId, "items.product_id": productId, "items.min_qty": minQty },
        {
          $set: {
            "items.$.unit_price": unitPrice,
            "items.$.currency_code": currencyCode ? normCurrency(currencyCode) : undefined,
            "items.$.billing_period": billingPeriod,
          },
        },
        { new: true, session }
      )
      .exec();

    if (updated) return updated;

    // If not found, push a new tier
    return (this as any).model
      .findByIdAndUpdate(
        priceListId,
        {
          $push: {
            items: {
              product_id: new Types.ObjectId(productId),
              unit_price: unitPrice,
              min_qty: Math.max(1, minQty),
              ...(currencyCode ? { currency_code: normCurrency(currencyCode) } : {}),
              billing_period: billingPeriod,
            },
          },
        },
        { new: true, session }
      )
      .exec();
  }

  /** Remove a price item (by product_id and optionally by min_qty specific tier) */
  async removeItem(
    priceListId: Types.ObjectId | string,
    productId: Types.ObjectId | string,
    minQty?: number,
    opts?: WriteOptions
  ): Promise<PriceListDoc | null> {
    const match: any = { product_id: new Types.ObjectId(productId) };
    if (minQty != null) match.min_qty = minQty;
    return (this as any).model.findByIdAndUpdate(priceListId, { $pull: { items: match } }, { new: true, session: opts?.session ?? undefined }).exec();
  }

  /**
   * Resolve the applicable lists given branch/user/date, ordered by priority desc.
   * If userId is provided, user lists come first, then branch lists (defaults included).
   */
  async getApplicableLists(
    branchId: Types.ObjectId | string,
    userId?: Types.ObjectId | string | null,
    onDate: Date = new Date(),
    opts?: ReadOptions
  ): Promise<PriceListDoc[]> {
    const lists: PriceListDoc[] = [];

    if (userId) {
      lists.push(...(await this.findForUser(userId, { ...opts, onDate, sort: { priority: -1, createdAt: -1 } })));
    }

    const branchLists = await this.findByBranch(branchId, { ...opts, onDate, sort: { priority: -1, createdAt: -1 } });
    lists.push(...branchLists);

    // Deduplicate by _id while preserving order
    const seen = new Set<string>();
    const ordered: PriceListDoc[] = [];
    for (const pl of lists) {
      const id = String(pl._id);
      if (!seen.has(id)) {
        seen.add(id);
        ordered.push(pl);
      }
    }
    return ordered;
  }

  /**
   * Compute effective unit price for a product, considering:
   * - user-specific price lists first (if provided)
   * - then branch lists (including default)
   * - validity windows, active flag
   * - min_qty tiers (choose the best tier where min_qty <= qty)
   * Returns { price, currency, sourcePriceListId } or null if none found.
   */
  async getEffectivePrice(
    params: {
      branchId: Types.ObjectId | string;
      productId: Types.ObjectId | string;
      quantity?: number;
      userId?: Types.ObjectId | string | null;
      onDate?: Date;
    },
    opts?: ReadOptions
  ): Promise<{ price: number; billingPeriod: "per_delivery" | "monthly"; currency: string | null; sourcePriceListId: Types.ObjectId } | null> {
    const { branchId, productId, quantity = 1, userId = null, onDate = new Date() } = params;

    const applicable = await this.getApplicableLists(branchId, userId, onDate, opts);
    if (!applicable.length) return null;

    // Iterate in priority order; pick the first list with a qualifying tier
    for (const pl of applicable) {
      const tiers = (pl.items ?? []).filter((i) => String(i.product_id) === String(productId)).sort((a, b) => (b.min_qty ?? 1) - (a.min_qty ?? 1)); // highest min_qty first

      const chosen = tiers.find((t) => (t.min_qty ?? 1) <= quantity);
      if (chosen) {
        return {
          price: chosen.unit_price,
          billingPeriod: chosen.billing_period ?? "per_delivery",
          currency: chosen.currency_code ?? pl.currency_code ?? null,
          sourcePriceListId: pl._id as any,
        };
      }
    }

    return null;
  }
}

// Optional singleton
export const priceListRepository = new PriceListRepository();
