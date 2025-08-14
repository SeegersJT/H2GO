import type { Model, HydratedDocument } from "mongoose";
import CounterModel from "../models/Counter.model";
import type { ICounter } from "../models/Counter.model";
import { GenericRepository, ReadOptions, WriteOptions } from "./Generic.repository";

export type CounterDoc = HydratedDocument<ICounter>;

export class CounterRepository extends GenericRepository<ICounter, CounterDoc> {
  constructor(model: Model<ICounter, any, any, any, CounterDoc> = CounterModel as any) {
    super(model);
  }

  /** Get current value for counter id */
  async get(id: string, opts?: ReadOptions): Promise<CounterDoc | null> {
    return this.findById(id, opts);
  }

  /** Increment and return new value */
  async increment(id: string, by = 1, opts?: WriteOptions): Promise<number> {
    const doc = await (this as any).model
      .findByIdAndUpdate(id, { $inc: { seq: by } }, { upsert: true, new: true, session: opts?.session ?? undefined })
      .exec();
    return doc.seq;
  }
}

export const counterRepository = new CounterRepository();
