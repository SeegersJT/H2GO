import { ClientSession, FilterQuery, ProjectionType, PopulateOptions } from "mongoose";
import BaseRepository, { PaginateOptions, PaginatedResult } from "../repositories/Base.repository";
import { Lean } from "./Types";

export default class BaseService<TRaw extends Record<string, unknown>> {
  protected repo: BaseRepository<TRaw>;

  constructor(repo: BaseRepository<TRaw>) {
    this.repo = repo;
  }

  create(payload: Partial<TRaw>, opts?: { session?: ClientSession }) {
    return this.repo.create(payload, opts);
  }

  findById(id: string, opts?: { select?: ProjectionType<TRaw>; populate?: string | PopulateOptions | (string | PopulateOptions)[] }) {
    return this.repo.findById(id, opts);
  }

  findOne(filter: FilterQuery<TRaw>, opts?: { select?: ProjectionType<TRaw>; populate?: string | PopulateOptions | (string | PopulateOptions)[] }) {
    return this.repo.findOne(filter, opts);
  }

  find(
    filter: FilterQuery<TRaw>,
    opts?: {
      select?: ProjectionType<TRaw>;
      sort?: Record<string, 1 | -1>;
      limit?: number;
      populate?: string | PopulateOptions | (string | PopulateOptions)[];
    }
  ) {
    return this.repo.find(filter, opts);
  }

  paginate(filter: FilterQuery<TRaw>, options?: PaginateOptions<TRaw>): Promise<PaginatedResult<Lean<TRaw>>> {
    return this.repo.paginate(filter, options);
  }

  updateById(id: string, update: Partial<TRaw>, opts?: { session?: ClientSession }) {
    return this.repo.updateById(id, update as any, { ...opts, new: true });
  }

  updateOne(filter: FilterQuery<TRaw>, update: Partial<TRaw>, opts?: { session?: ClientSession }) {
    return this.repo.updateOne(filter, update as any, opts);
  }

  deleteById(id: string, opts?: { session?: ClientSession }) {
    return this.repo.deleteById(id, opts);
  }
}
