import { ClientSession, FilterQuery, Model, QueryOptions, UpdateQuery } from "mongoose";

export interface PaginateOptions {
  page?: number;
  limit?: number;
  sort?: Record<string, 1 | -1>;
  select?: Record<string, 0 | 1>;
  populate?: string | string[];
  lean?: boolean;
}

export interface PaginatedResult<T> {
  docs: T[];
  page: number;
  limit: number;
  totalDocs: number;
  totalPages: number;
}

export default class BaseRepository<T> {
  protected model: Model<T>;

  constructor(model: Model<T>) {
    this.model = model;
  }

  async create(payload: Partial<T>, opts?: { session?: ClientSession }): Promise<T> {
    const doc = await this.model.create([payload], { session: opts?.session });
    return doc[0];
  }

  async findById(id: string, opts?: { select?: any; populate?: any; lean?: boolean }): Promise<T | null> {
    let q = this.model.findById(id);
    if (opts?.select) q = q.select(opts.select);
    if (opts?.populate) q = q.populate(opts.populate);
    if (opts?.lean) q = q.lean();
    return q.exec();
  }

  async findOne(filter: FilterQuery<T>, opts?: { select?: any; populate?: any; lean?: boolean }): Promise<T | null> {
    let q = this.model.findOne(filter);
    if (opts?.select) q = q.select(opts.select);
    if (opts?.populate) q = q.populate(opts.populate);
    if (opts?.lean) q = q.lean();
    return q.exec();
  }

  async find(filter: FilterQuery<T>, opts?: { select?: any; sort?: any; limit?: number; populate?: any; lean?: boolean }): Promise<T[]> {
    let q = this.model.find(filter);
    if (opts?.select) q = q.select(opts.select);
    if (opts?.sort) q = q.sort(opts.sort);
    if (opts?.limit) q = q.limit(opts.limit);
    if (opts?.populate) q = q.populate(opts.populate);
    if (opts?.lean) q = q.lean();
    return q.exec();
  }

  async updateById(id: string, update: UpdateQuery<T>, opts?: { session?: ClientSession; new?: boolean }): Promise<T | null> {
    const qopts: QueryOptions = { new: opts?.new ?? true, session: opts?.session };
    return this.model.findByIdAndUpdate(id, update, qopts).exec();
  }

  async updateOne(filter: FilterQuery<T>, update: UpdateQuery<T>, opts?: { session?: ClientSession }): Promise<{ modifiedCount: number }> {
    const res = await this.model.updateOne(filter, update, { session: opts?.session }).exec();
    return { modifiedCount: res.modifiedCount ?? 0 };
  }

  async deleteById(id: string, opts?: { session?: ClientSession }): Promise<{ deletedCount: number }> {
    const res = await this.model.deleteOne({ _id: id } as any, { session: opts?.session }).exec();
    return { deletedCount: res.deletedCount ?? 0 };
  }

  async paginate(filter: FilterQuery<T>, options: PaginateOptions = {}): Promise<PaginatedResult<T>> {
    const page = Math.max(1, options.page ?? 1);
    const limit = Math.max(1, Math.min(200, options.limit ?? 20));
    const skip = (page - 1) * limit;

    let q = this.model.find(filter).skip(skip).limit(limit);

    if (options.sort) q = q.sort(options.sort);
    if (options.select) q = q.select(options.select);
    if (options.populate) q = q.populate(options.populate);
    if (options.lean) q = q.lean();

    const [docs, totalDocs] = await Promise.all([q.exec(), this.model.countDocuments(filter).exec()]);

    return {
      docs,
      page,
      limit,
      totalDocs,
      totalPages: Math.max(1, Math.ceil(totalDocs / limit)),
    };
  }
}
