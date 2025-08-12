import {
  ClientSession,
  FilterQuery,
  HydratedDocument,
  Model,
  PopulateOptions,
  ProjectionType,
  QueryOptions,
  UpdateQuery,
  FlattenMaps,
  Require_id,
} from "mongoose";

/**
 * Lean document shape for Mongoose v8.
 * (What you get back when you call .lean(): plain JSON-friendly object with _id)
 */
export type LeanDoc<T> = Require_id<FlattenMaps<T>>;

/** Options for list/paginated reads */
export interface PaginateOptions<T = unknown> {
  page?: number; // 1-based page
  limit?: number; // items per page
  sort?: Record<string, 1 | -1>;
  select?: ProjectionType<T>;
  populate?: string | PopulateOptions | (string | PopulateOptions)[];
}

/** Result shape for pagination */
export interface PaginatedResult<T> {
  docs: T[];
  page: number;
  limit: number;
  totalDocs: number;
  totalPages: number;
}

/**
 * BaseRepository
 *  - All READS return lean objects (plain JSON-safe) for speed and simplicity.
 *  - WRITES (create/update) return hydrated docs in case you need .save() later.
 *  - If you need hydrated reads, use the explicit *Hydrated helpers.
 */
export default class BaseRepository<TRaw extends object> {
  protected model: Model<TRaw>;

  constructor(model: Model<TRaw>) {
    this.model = model;
  }

  // ----------------------------
  // Writes: return hydrated docs
  // ----------------------------

  /** Create a document (returns a hydrated Mongoose doc). */
  async create(payload: Partial<TRaw>, opts?: { session?: ClientSession }): Promise<HydratedDocument<TRaw>> {
    const [doc] = await this.model.create([payload], { session: opts?.session });
    return doc as HydratedDocument<TRaw>;
  }

  /** Update by id (returns updated hydrated doc or null). */
  async updateById(id: string, update: UpdateQuery<TRaw>, opts?: { session?: ClientSession; new?: boolean }): Promise<HydratedDocument<TRaw> | null> {
    const qopts: QueryOptions = { new: opts?.new ?? true, session: opts?.session };
    return this.model.findByIdAndUpdate(id, update, qopts).exec();
  }

  /** Update one by filter (returns modifiedCount). */
  async updateOne(filter: FilterQuery<TRaw>, update: UpdateQuery<TRaw>, opts?: { session?: ClientSession }): Promise<{ modifiedCount: number }> {
    const res = await this.model.updateOne(filter, update, { session: opts?.session }).exec();
    return { modifiedCount: res.modifiedCount ?? 0 };
  }

  /** Delete by id (returns deletedCount). */
  async deleteById(id: string, opts?: { session?: ClientSession }): Promise<{ deletedCount: number }> {
    const res = await this.model.deleteOne({ _id: id } as any, { session: opts?.session }).exec();
    return { deletedCount: res.deletedCount ?? 0 };
  }

  // ---------------------------
  // Reads: return LEAN objects
  // ---------------------------

  /** Find by id (lean). */
  async findById(
    id: string,
    opts?: { select?: ProjectionType<TRaw>; populate?: string | PopulateOptions | (string | PopulateOptions)[] }
  ): Promise<LeanDoc<TRaw> | null> {
    let q = this.model.findById(id);
    if (opts?.select) q = q.select(opts.select);
    if (opts?.populate) q = q.populate(opts.populate as any);
    return q.lean().exec() as Promise<LeanDoc<TRaw> | null>;
  }

  /** Find one by filter (lean). */
  async findOne(
    filter: FilterQuery<TRaw>,
    opts?: { select?: ProjectionType<TRaw>; populate?: string | PopulateOptions | (string | PopulateOptions)[] }
  ): Promise<LeanDoc<TRaw> | null> {
    let q = this.model.findOne(filter);
    if (opts?.select) q = q.select(opts.select);
    if (opts?.populate) q = q.populate(opts.populate as any);
    return q.lean().exec() as Promise<LeanDoc<TRaw> | null>;
  }

  /** Find many by filter (lean). */
  async find(
    filter: FilterQuery<TRaw>,
    opts?: {
      select?: ProjectionType<TRaw>;
      sort?: Record<string, 1 | -1>;
      limit?: number;
      populate?: string | PopulateOptions | (string | PopulateOptions)[];
    }
  ): Promise<LeanDoc<TRaw>[]> {
    let q = this.model.find(filter);
    if (opts?.select) q = q.select(opts.select);
    if (opts?.sort) q = q.sort(opts.sort);
    if (opts?.limit) q = q.limit(opts.limit);
    if (opts?.populate) q = q.populate(opts.populate as any);
    return q.lean().exec() as Promise<LeanDoc<TRaw>[]>;
  }

  /** Paginated list (lean). */
  async paginate(filter: FilterQuery<TRaw>, options: PaginateOptions<TRaw> = {}): Promise<PaginatedResult<LeanDoc<TRaw>>> {
    const page = Math.max(1, options.page ?? 1);
    const limit = Math.max(1, Math.min(200, options.limit ?? 20));
    const skip = (page - 1) * limit;

    let q = this.model.find(filter).skip(skip).limit(limit);
    if (options.sort) q = q.sort(options.sort);
    if (options.select) q = q.select(options.select);
    if (options.populate) q = q.populate(options.populate as any);

    const [docs, totalDocs] = await Promise.all([q.lean().exec(), this.model.countDocuments(filter).exec()]);

    return {
      docs: docs as LeanDoc<TRaw>[],
      page,
      limit,
      totalDocs,
      totalPages: Math.max(1, Math.ceil(totalDocs / limit)),
    };
  }

  // -------------------------------------------------
  // Optional: hydrated read helpers when you need them
  // -------------------------------------------------

  /** Hydrated findById (use only if you truly need a Mongoose document). */
  async findByIdHydrated(
    id: string,
    opts?: { select?: ProjectionType<TRaw>; populate?: string | PopulateOptions | (string | PopulateOptions)[] }
  ): Promise<HydratedDocument<TRaw> | null> {
    let q = this.model.findById(id);
    if (opts?.select) q = q.select(opts.select);
    if (opts?.populate) q = q.populate(opts.populate as any);
    return q.exec();
  }

  /** Hydrated findOne (use only if you truly need a Mongoose document). */
  async findOneHydrated(
    filter: FilterQuery<TRaw>,
    opts?: { select?: ProjectionType<TRaw>; populate?: string | PopulateOptions | (string | PopulateOptions)[] }
  ): Promise<HydratedDocument<TRaw> | null> {
    let q = this.model.findOne(filter);
    if (opts?.select) q = q.select(opts.select);
    if (opts?.populate) q = q.populate(opts.populate as any);
    return q.exec();
  }
}
