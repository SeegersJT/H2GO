import { ClientSession, FilterQuery, HydratedDocument, Model, PopulateOptions, ProjectionType, QueryOptions, UpdateQuery } from "mongoose";

export interface PaginateOptions<T = any> {
  page?: number;
  limit?: number;
  sort?: Record<string, 1 | -1>;
  select?: ProjectionType<T>;
  populate?: string | PopulateOptions | (string | PopulateOptions)[];
  lean?: boolean;
}

export interface PaginatedResult<T> {
  docs: T[];
  page: number;
  limit: number;
  totalDocs: number;
  totalPages: number;
}

// Helper: map lean flag to the correct return type
type MaybeLean<TRaw, TLean extends boolean | undefined> = TLean extends true ? TRaw : HydratedDocument<TRaw>;

export default class BaseRepository<TRaw> {
  protected model: Model<TRaw>;

  constructor(model: Model<TRaw>) {
    this.model = model;
  }

  async create(payload: Partial<TRaw>, opts?: { session?: ClientSession }): Promise<HydratedDocument<TRaw>> {
    const [doc] = await this.model.create([payload], { session: opts?.session });
    return doc as HydratedDocument<TRaw>;
  }

  // --- findById ---

  async findById(id: string): Promise<HydratedDocument<TRaw> | null>;
  async findById<TLean extends boolean | undefined = false>(
    id: string,
    opts: { select?: ProjectionType<TRaw>; populate?: string | PopulateOptions | (string | PopulateOptions)[]; lean?: TLean }
  ): Promise<MaybeLean<TRaw, TLean> | null>;
  async findById<TLean extends boolean | undefined = false>(
    id: string,
    opts?: { select?: ProjectionType<TRaw>; populate?: string | PopulateOptions | (string | PopulateOptions)[]; lean?: TLean }
  ): Promise<MaybeLean<TRaw, TLean> | null> {
    let q = this.model.findById(id);
    if (opts?.select) q = q.select(opts.select);
    if (opts?.populate) q = q.populate(opts.populate as any);
    if (opts?.lean) q = q.lean(true);
    return q.exec() as any;
  }

  // --- findOne ---

  async findOne(filter: FilterQuery<TRaw>): Promise<HydratedDocument<TRaw> | null>;
  async findOne<TLean extends boolean | undefined = false>(
    filter: FilterQuery<TRaw>,
    opts: { select?: ProjectionType<TRaw>; populate?: string | PopulateOptions | (string | PopulateOptions)[]; lean?: TLean }
  ): Promise<MaybeLean<TRaw, TLean> | null>;
  async findOne<TLean extends boolean | undefined = false>(
    filter: FilterQuery<TRaw>,
    opts?: { select?: ProjectionType<TRaw>; populate?: string | PopulateOptions | (string | PopulateOptions)[]; lean?: TLean }
  ): Promise<MaybeLean<TRaw, TLean> | null> {
    let q = this.model.findOne(filter);
    if (opts?.select) q = q.select(opts.select);
    if (opts?.populate) q = q.populate(opts.populate as any);
    if (opts?.lean) q = q.lean(true);
    return q.exec() as any;
  }

  // --- find ---

  async find(filter: FilterQuery<TRaw>): Promise<HydratedDocument<TRaw>[]>;
  async find<TLean extends boolean | undefined = false>(
    filter: FilterQuery<TRaw>,
    opts: {
      select?: ProjectionType<TRaw>;
      sort?: Record<string, 1 | -1>;
      limit?: number;
      populate?: string | PopulateOptions | (string | PopulateOptions)[];
      lean?: TLean;
    }
  ): Promise<MaybeLean<TRaw, TLean>[]>;
  async find<TLean extends boolean | undefined = false>(
    filter: FilterQuery<TRaw>,
    opts?: {
      select?: ProjectionType<TRaw>;
      sort?: Record<string, 1 | -1>;
      limit?: number;
      populate?: string | PopulateOptions | (string | PopulateOptions)[];
      lean?: TLean;
    }
  ): Promise<MaybeLean<TRaw, TLean>[]> {
    let q = this.model.find(filter);
    if (opts?.select) q = q.select(opts.select);
    if (opts?.sort) q = q.sort(opts.sort);
    if (opts?.limit) q = q.limit(opts.limit);
    if (opts?.populate) q = q.populate(opts.populate as any);
    if (opts?.lean) q = q.lean(true);
    return q.exec() as any;
  }

  async updateById(id: string, update: UpdateQuery<TRaw>, opts?: { session?: ClientSession; new?: boolean }): Promise<HydratedDocument<TRaw> | null> {
    const qopts: QueryOptions = { new: opts?.new ?? true, session: opts?.session };
    return this.model.findByIdAndUpdate(id, update, qopts).exec();
  }

  async updateOne(filter: FilterQuery<TRaw>, update: UpdateQuery<TRaw>, opts?: { session?: ClientSession }): Promise<{ modifiedCount: number }> {
    const res = await this.model.updateOne(filter, update, { session: opts?.session }).exec();
    return { modifiedCount: res.modifiedCount ?? 0 };
  }

  async deleteById(id: string, opts?: { session?: ClientSession }): Promise<{ deletedCount: number }> {
    const res = await this.model.deleteOne({ _id: id } as any, { session: opts?.session }).exec();
    return { deletedCount: res.deletedCount ?? 0 };
  }

  async paginate<TLean extends boolean | undefined = false>(
    filter: FilterQuery<TRaw>,
    options: PaginateOptions<TRaw> = {}
  ): Promise<PaginatedResult<MaybeLean<TRaw, TLean>>> {
    const page = Math.max(1, options.page ?? 1);
    const limit = Math.max(1, Math.min(200, options.limit ?? 20));
    const skip = (page - 1) * limit;

    let q = this.model.find(filter).skip(skip).limit(limit);

    if (options.sort) q = q.sort(options.sort);
    if (options.select) q = q.select(options.select);
    if (options.populate) q = q.populate(options.populate as any);
    if (options.lean) q = q.lean(true);

    const [docs, totalDocs] = await Promise.all([q.exec(), this.model.countDocuments(filter).exec()]);

    return {
      docs: docs as any,
      page,
      limit,
      totalDocs,
      totalPages: Math.max(1, Math.ceil(totalDocs / limit)),
    };
  }
}
