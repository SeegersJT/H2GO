// src/repositories/GenericRepository.ts
import type { Model, AnyKeys, ClientSession, HydratedDocument, PipelineStage } from "mongoose";

export type WriteOptions = {
  session?: ClientSession | null;
  actorId?: any | null; // Prefer Types.ObjectId in your codebase
};

export type ReadOptions = {
  session?: ClientSession | null;
  projection?: any;
  populate?: any;
  sort?: any;
  collation?: any;
  lean?: boolean;
  includeInactive?: boolean; // if false (default) and schema has `active`, auto-filter to active: true
};

export type PaginateResult<T> = {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  pages: number;
};

type WithMaybeId = { _id?: unknown };

export class GenericRepository<TSchema extends WithMaybeId, TDoc extends HydratedDocument<TSchema> = HydratedDocument<TSchema>> {
  // Note: the 5th generic parameter binds the hydrated doc type for better return typing
  constructor(private readonly model: Model<TSchema, any, any, any, TDoc>) {}

  // ---------- Internal helpers ----------

  private applyAuditOnCreate(obj: AnyKeys<TSchema>, opts?: WriteOptions) {
    if (!opts?.actorId) return;
    const anyObj = obj as any;
    if ("createdBy" in anyObj && (anyObj.createdBy == null || anyObj.createdBy === undefined)) {
      anyObj.createdBy = opts.actorId;
    }
    if ("updatedBy" in anyObj) {
      anyObj.updatedBy = opts.actorId;
    }
  }

  private applyAuditOnUpdate(obj: AnyKeys<TSchema>, opts?: WriteOptions) {
    if (!opts?.actorId) return;
    const anyObj = obj as any;
    if ("updatedBy" in anyObj) {
      anyObj.updatedBy = opts.actorId;
    }
  }

  /** Adds `{active: true}` by default when the schema has an `active` path */
  private baseFilter(filter: any = {}, opts?: ReadOptions) {
    const hasActivePath = "active" in this.model.schema.paths;
    if (hasActivePath && !opts?.includeInactive) {
      return { ...filter, active: true };
    }
    return filter;
  }

  // ---------- Create ----------

  /** Create one (typed) */
  async create(doc: AnyKeys<TSchema>, opts?: WriteOptions): Promise<TDoc> {
    this.applyAuditOnCreate(doc, opts);
    const [result] = await this.model.create([doc], { session: opts?.session ?? undefined });
    return result as TDoc;
  }

  /**
   * Create many — uses `Model.create()` instead of `insertMany()` to keep typings clean (returns TDoc[])
   * and to run middleware/validation consistently.
   */
  async createMany(docs: AnyKeys<TSchema>[], opts?: WriteOptions): Promise<TDoc[]> {
    docs.forEach((d) => this.applyAuditOnCreate(d, opts));
    return this.model.create(docs as any, { session: opts?.session ?? undefined }) as Promise<TDoc[]>;
  }

  // ---------- Read ----------

  /** Find by id (respects soft-delete filter if schema has `active`) */
  async findById(id: any, opts?: ReadOptions): Promise<TDoc | null> {
    const hasActivePath = "active" in this.model.schema.paths;
    const useActiveFilter = hasActivePath && !opts?.includeInactive;

    let q = useActiveFilter
      ? this.model.findOne({ _id: id, active: true }, opts?.projection, { session: opts?.session ?? undefined })
      : this.model.findById(id, opts?.projection, { session: opts?.session ?? undefined });

    if (opts?.populate) q = q.populate(opts.populate);
    if (opts?.collation) q = q.collation(opts.collation);
    if (opts?.lean) return q.lean().exec() as any;
    return q.exec() as Promise<TDoc | null>;
  }

  /** Find one (respects soft-delete filter if schema has `active`) */
  async findOne(filter: any, opts?: ReadOptions): Promise<TDoc | null> {
    const qFilter = this.baseFilter(filter, opts);
    let q = this.model.findOne(qFilter, opts?.projection, { session: opts?.session ?? undefined });
    if (opts?.sort) q = q.sort(opts?.sort);
    if (opts?.populate) q = q.populate(opts?.populate);
    if (opts?.collation) q = q.collation(opts?.collation);
    if (opts?.lean) return q.lean().exec() as any;
    return q.exec() as Promise<TDoc | null>;
  }

  /** Find many (respects soft-delete filter if schema has `active`) */
  async findMany(filter: any, opts?: ReadOptions): Promise<TDoc[]> {
    const qFilter = this.baseFilter(filter, opts);
    let q = this.model.find(qFilter, opts?.projection, { session: opts?.session ?? undefined });
    if (opts?.sort) q = q.sort(opts?.sort);
    if (opts?.populate) q = q.populate(opts?.populate);
    if (opts?.collation) q = q.collation(opts?.collation);
    if (opts?.lean) return q.lean().exec() as any;
    return q.exec() as Promise<TDoc[]>;
  }

  /** Paginate (respects soft-delete filter) */
  async paginate(filter: any, opts?: ReadOptions & { page?: number; pageSize?: number }): Promise<PaginateResult<TDoc>> {
    const page = Math.max(1, opts?.page ?? 1);
    const pageSize = Math.min(200, Math.max(1, opts?.pageSize ?? 20));
    const qFilter = this.baseFilter(filter, opts);

    let q = this.model.find(qFilter, opts?.projection, { session: opts?.session ?? undefined });
    if (opts?.sort) q = q.sort(opts?.sort);
    if (opts?.populate) q = q.populate(opts?.populate);
    if (opts?.collation) q = q.collation(opts?.collation);

    const [items, total] = await Promise.all([
      q
        .skip((page - 1) * pageSize)
        .limit(pageSize)
        .exec(),
      this.model.countDocuments(qFilter).session(opts?.session ?? undefined),
    ]);

    const pages = Math.max(1, Math.ceil(total / pageSize));
    return { items: items as TDoc[], total, page, pageSize, pages };
  }

  // ---------- Update / Upsert ----------

  /** Update by id (returns the updated doc by default) */
  async updateById(id: any, update: AnyKeys<TSchema>, opts?: WriteOptions & { new?: boolean }): Promise<TDoc | null> {
    this.applyAuditOnUpdate(update, opts);
    return this.model
      .findByIdAndUpdate(id, update, {
        new: opts?.new ?? true,
        session: opts?.session ?? undefined,
      })
      .exec() as Promise<TDoc | null>;
  }

  /** Upsert (findOneAndUpdate with upsert) -> always returns a doc */
  async upsert(filter: any, update: AnyKeys<TSchema>, opts?: WriteOptions): Promise<TDoc> {
    this.applyAuditOnUpdate(update, opts);
    const doc = await this.model.findOneAndUpdate(filter, update, {
      upsert: true,
      new: true,
      setDefaultsOnInsert: true,
      session: opts?.session ?? undefined,
    });
    return doc as TDoc; // upsert+new guarantees doc
  }

  // ---------- Aggregate ----------

  /** Aggregate with optional soft-delete `$match` preprended (unless includeInactive=true) */
  async aggregate<R = any>(
    pipeline: PipelineStage[],
    opts?: { session?: ClientSession | null; allowDiskUse?: boolean; includeInactive?: boolean }
  ): Promise<R[]> {
    const stages = [...pipeline];
    const hasActivePath = "active" in this.model.schema.paths;
    if (hasActivePath && !opts?.includeInactive) {
      stages.unshift({ $match: { active: true } } as PipelineStage);
    }
    return this.model
      .aggregate<R>(stages, {
        allowDiskUse: opts?.allowDiskUse ?? true,
        session: opts?.session ?? undefined,
      })
      .exec();
  }

  // ---------- Delete (soft/hard) ----------

  /** Delete by id (soft if `active` exists, else hard) */
  async deleteById(id: any, opts?: WriteOptions): Promise<boolean> {
    const hasActivePath = "active" in this.model.schema.paths;
    if (hasActivePath) {
      const res = await this.model.findByIdAndUpdate(id, { $set: { active: false } as any }, { session: opts?.session ?? undefined });
      return !!res;
    }
    const res = await this.model.findByIdAndDelete(id, { session: opts?.session ?? undefined });
    return !!res;
  }

  /** Delete many (soft if `active` exists, else hard). Returns number affected. */
  async deleteMany(filter: any, opts?: WriteOptions): Promise<number> {
    const hasActivePath = "active" in this.model.schema.paths;
    if (hasActivePath) {
      const res = await this.model.updateMany(filter, { $set: { active: false } as any }, { session: opts?.session ?? undefined });
      // Mongoose UpdateResult has modifiedCount in modern drivers
      return (res as any).modifiedCount ?? (res as any).nModified ?? 0;
    }
    const res = await this.model.deleteMany(filter, { session: opts?.session ?? undefined });
    return res.deletedCount ?? 0;
  }

  // ---------- Existence / Count ----------

  async exists(filter: any, opts?: ReadOptions): Promise<boolean> {
    const qFilter = this.baseFilter(filter, opts);
    const q = this.model.exists(qFilter);
    if (opts?.session) q.session(opts.session);
    const res = await q;
    return !!res;
  }

  async count(filter: any, opts?: ReadOptions): Promise<number> {
    const qFilter = this.baseFilter(filter, opts);
    const q = this.model.countDocuments(qFilter);
    if (opts?.session) q.session(opts.session);
    return q.exec();
  }

  // ---------- Transactions ----------

  /** Convenience helper to run a function within a transaction */
  async runInTransaction<R>(fn: (session: ClientSession) => Promise<R>): Promise<R> {
    const session = await this.model.db.startSession();
    try {
      let result!: R;
      await session.withTransaction(async () => {
        result = await fn(session);
      });
      return result;
    } finally {
      await session.endSession();
    }
  }

  // ---------- Small convenience ----------

  /** Get by id or throw standardized error */
  async getByIdOrThrow(id: any, opts?: ReadOptions): Promise<TDoc> {
    const doc = await this.findById(id, opts);
    if (!doc) {
      throw new Error(`${this.model.modelName} not found`);
    }
    return doc;
  }
}
