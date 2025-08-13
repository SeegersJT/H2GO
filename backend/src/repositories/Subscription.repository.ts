// src/repositories/Subscription.repository.ts
import type { Model, HydratedDocument } from "mongoose";
import { Types } from "mongoose";
import SubscriptionModel from "../models/Subscription.model";
import type { ISubscription, SubscriptionStatus } from "../models/Subscription.model";
import { GenericRepository, ReadOptions, WriteOptions, PaginateResult } from "./Generic.repository";

export type SubscriptionDoc = HydratedDocument<ISubscription>;

export class SubscriptionRepository extends GenericRepository<ISubscription, SubscriptionDoc> {
  constructor(model: Model<ISubscription, any, any, any, SubscriptionDoc> = SubscriptionModel as any) {
    super(model);
  }

  async findBySubscriptionNo(subscriptionNo: string, opts?: ReadOptions): Promise<SubscriptionDoc | null> {
    return this.findOne({ subscription_no: subscriptionNo }, opts);
  }

  async findByCustomer(customerId: Types.ObjectId | string, opts?: ReadOptions): Promise<SubscriptionDoc[]> {
    return this.findMany({ customer_id: customerId }, opts);
  }

  async dueForRun(before: Date, opts?: ReadOptions): Promise<SubscriptionDoc[]> {
    return this.findMany({ next_run_at: { $lte: before }, status: "active" }, opts);
  }

  async searchInBranch(
    branchId: Types.ObjectId | string,
    q: string | undefined,
    opts?: ReadOptions & { page?: number; pageSize?: number }
  ): Promise<PaginateResult<SubscriptionDoc>> {
    const filter: any = { branch_id: branchId };
    if (q && q.trim()) {
      const rx = new RegExp(q.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
      filter.$or = [{ subscription_no: rx }, { rrule: rx }];
    }
    return this.paginate(filter, { ...opts, sort: opts?.sort ?? { createdAt: -1 } });
  }

  async setStatus(subscriptionId: Types.ObjectId | string, status: SubscriptionStatus, opts?: WriteOptions): Promise<SubscriptionDoc | null> {
    return (this as any).model.findByIdAndUpdate(subscriptionId, { $set: { status } }, { new: true, session: opts?.session ?? undefined }).exec();
  }
}

export const subscriptionRepository = new SubscriptionRepository();
