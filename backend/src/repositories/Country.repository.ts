// src/repositories/Country.repository.ts
import type { Model, HydratedDocument } from "mongoose";
import CountryModel from "../models/Country.model";
import type { ICountry } from "../models/Country.model";
import { GenericRepository, ReadOptions, PaginateResult } from "./Generic.repository";

export type CountryDoc = HydratedDocument<ICountry>;

export class CountryRepository extends GenericRepository<ICountry, CountryDoc> {
  constructor(model: Model<ICountry, any, any, any, CountryDoc> = CountryModel as any) {
    super(model);
  }

  /** Find by ISO code */
  async findByCode(code: string, opts?: ReadOptions): Promise<CountryDoc | null> {
    return this.findOne({ country_code: code.toUpperCase() }, opts);
  }

  /** Search across country name or code */
  async search(q: string | undefined, opts?: ReadOptions & { page?: number; pageSize?: number }): Promise<PaginateResult<CountryDoc>> {
    const filter: any = {};
    if (q && q.trim()) {
      const s = q.trim();
      const rx = new RegExp(s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
      filter.$or = [{ country_name: rx }, { country_code: rx }];
    }
    return this.paginate(filter, { ...opts, sort: opts?.sort ?? { country_name: 1 } });
  }
}

export const countryRepository = new CountryRepository();
