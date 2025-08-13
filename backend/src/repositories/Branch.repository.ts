// src/repositories/Branch.repository.ts
import type { Model, HydratedDocument } from "mongoose";
import { Types } from "mongoose";
import BranchModel from "../models/Branch.model";
import type { IBranch } from "../models/Branch.model";
import { GenericRepository, PaginateResult, ReadOptions, WriteOptions } from "./Generic.repository";

export type BranchDoc = HydratedDocument<IBranch>;

function normAbbrev(abbrev: string) {
  return abbrev.trim().toUpperCase();
}

export class BranchRepository extends GenericRepository<IBranch, BranchDoc> {
  constructor(model: Model<IBranch, any, any, any, BranchDoc> = BranchModel as any) {
    super(model);
  }

  /** Find by abbreviation within a country (abbrev normalized to uppercase) */
  async findByAbbreviationInCountry(countryId: Types.ObjectId | string, abbreviation: string, opts?: ReadOptions): Promise<BranchDoc | null> {
    return this.findOne({ country_id: countryId, branch_abbreviation: normAbbrev(abbreviation) }, opts);
  }

  /** Find by name within a country */
  async findByNameInCountry(countryId: Types.ObjectId | string, name: string, opts?: ReadOptions): Promise<BranchDoc | null> {
    return this.findOne({ country_id: countryId, branch_name: name }, opts);
  }

  /** List branches in a country (respects includeInactive flag) */
  async findByCountry(countryId: Types.ObjectId | string, opts?: ReadOptions): Promise<BranchDoc[]> {
    return this.findMany({ country_id: countryId }, opts);
  }

  /** Search & paginate branches within a country across name/abbreviation */
  async searchInCountry(
    countryId: Types.ObjectId | string,
    q: string | undefined,
    opts?: ReadOptions & { page?: number; pageSize?: number }
  ): Promise<PaginateResult<BranchDoc>> {
    const filter: any = { country_id: countryId };
    if (q && q.trim()) {
      const s = q.trim();
      const rx = new RegExp(s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
      filter.$or = [{ branch_name: rx }, { branch_abbreviation: rx }];
    }
    return this.paginate(filter, { ...opts, sort: opts?.sort ?? { branch_name: 1 } });
  }

  /** Set active flag explicitly (soft delete still available via deleteById) */
  async setActive(branchId: Types.ObjectId | string, active: boolean, opts?: WriteOptions): Promise<BranchDoc | null> {
    return (this as any).model.findByIdAndUpdate(branchId, { $set: { active } }, { new: true, session: opts?.session ?? undefined }).exec();
  }

  /** Assign or clear head office reference for a branch */
  async setHeadOffice(
    branchId: Types.ObjectId | string,
    headofficeId: Types.ObjectId | string | null,
    opts?: WriteOptions
  ): Promise<BranchDoc | null> {
    return (this as any).model
      .findByIdAndUpdate(branchId, { $set: { headoffice_id: headofficeId } }, { new: true, session: opts?.session ?? undefined })
      .exec();
  }

  /** List branches that report to the given head office */
  async findChildren(headofficeId: Types.ObjectId | string, opts?: ReadOptions): Promise<BranchDoc[]> {
    return this.findMany({ headoffice_id: headofficeId }, opts);
  }

  /** Find the head office branch for a country */
  async findHeadOffice(countryId: Types.ObjectId | string, opts?: ReadOptions): Promise<BranchDoc | null> {
    return this.findOne({ country_id: countryId, headoffice_id: null }, opts);
  }
}

// Optional singleton
export const branchRepository = new BranchRepository();
