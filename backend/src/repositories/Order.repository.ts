import type { Model, HydratedDocument } from "mongoose";
import { Types } from "mongoose";
import OrderModel from "../models/Order.model";
import type { IOrder, OrderStatus } from "../models/Order.model";
import { GenericRepository, PaginateResult, ReadOptions, WriteOptions } from "./Generic.repository";

export type OrderDoc = HydratedDocument<IOrder>;

export class OrderRepository extends GenericRepository<IOrder, OrderDoc> {
  constructor(model: Model<IOrder, any, any, any, OrderDoc> = OrderModel as any) {
    super(model);
  }

  /** Find by human order code (order_no) */
  async findByOrderNo(orderNo: string, opts?: ReadOptions): Promise<OrderDoc | null> {
    return this.findOne({ order_no: orderNo }, opts);
  }

  /** List orders in a branch */
  async findByBranch(branchId: Types.ObjectId | string, opts?: ReadOptions): Promise<OrderDoc[]> {
    return this.findMany({ branch_id: branchId }, opts);
  }

  /** List orders for a given user */
  async findByUser(userId: Types.ObjectId | string, opts?: ReadOptions): Promise<OrderDoc[]> {
    return this.findMany({ user_id: userId }, opts);
  }

  /** List orders in a branch within a date range (inclusive start, exclusive end) */
  async findByDateRangeInBranch(branchId: Types.ObjectId | string, start: Date, end: Date, opts?: ReadOptions): Promise<OrderDoc[]> {
    const filter = { branch_id: branchId, desired_date: { $gte: start, $lt: end } };
    return this.findMany(filter, { ...opts, sort: opts?.sort ?? { desired_date: 1 } });
  }

  /** Search & paginate orders in a branch across order_no and notes */
  async searchInBranch(
    branchId: Types.ObjectId | string,
    q: string | undefined,
    opts?: ReadOptions & { page?: number; pageSize?: number }
  ): Promise<PaginateResult<OrderDoc>> {
    const filter: any = { branch_id: branchId };
    if (q && q.trim()) {
      const s = q.trim();
      const rx = new RegExp(s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
      filter.$or = [{ order_no: rx }, { notes: rx }];
    }
    return this.paginate(filter, { ...opts, sort: opts?.sort ?? { desired_date: -1, createdAt: -1 } });
  }

  /** Update order status */
  async setStatus(orderId: Types.ObjectId | string, status: OrderStatus, opts?: WriteOptions): Promise<OrderDoc | null> {
    return (this as any).model.findByIdAndUpdate(orderId, { $set: { status } }, { new: true, session: opts?.session ?? undefined }).exec();
  }

  /** Update totals snapshot */
  async setTotals(orderId: Types.ObjectId | string, totals: NonNullable<IOrder["totals"]>, opts?: WriteOptions): Promise<OrderDoc | null> {
    return (this as any).model.findByIdAndUpdate(orderId, { $set: { totals } }, { new: true, session: opts?.session ?? undefined }).exec();
  }
}

// Optional singleton
export const orderRepository = new OrderRepository();
