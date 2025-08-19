import type { Model, HydratedDocument } from "mongoose";
import { Types } from "mongoose";
import DeliveryModel from "../models/Delivery.model";
import type { IDelivery, DeliveryStatus } from "../models/Delivery.model";
import { GenericRepository, PaginateResult, ReadOptions, WriteOptions } from "./Generic.repository";

export type DeliveryDoc = HydratedDocument<IDelivery>;

export class DeliveryRepository extends GenericRepository<IDelivery, DeliveryDoc> {
  constructor(model: Model<IDelivery, any, any, any, DeliveryDoc> = DeliveryModel as any) {
    super(model);
  }

  /** Find by human delivery code (delivery_no) */
  async findByDeliveryNo(deliveryNo: string, opts?: ReadOptions): Promise<DeliveryDoc | null> {
    return this.findOne({ delivery_no: deliveryNo }, opts);
  }

  /** List deliveries for a route */
  async findByRoute(routeId: Types.ObjectId | string, opts?: ReadOptions): Promise<DeliveryDoc[]> {
    return this.findMany({ route_id: routeId }, { ...opts, sort: opts?.sort ?? { sequence: 1 } });
  }

  /** List deliveries for a branch */
  async findByBranch(branchId: Types.ObjectId | string, opts?: ReadOptions): Promise<DeliveryDoc[]> {
    return this.findMany({ branch_id: branchId }, opts);
  }

  /** List deliveries linked to an order */
  async findByOrder(orderId: Types.ObjectId | string, opts?: ReadOptions): Promise<DeliveryDoc[]> {
    return this.findMany({ order_id: orderId }, opts);
  }

  /** List deliveries for a user */
  async findByUser(userId: Types.ObjectId | string, opts?: ReadOptions): Promise<DeliveryDoc[]> {
    return this.findMany({ user_id: userId }, opts);
  }

  /** List deliveries in a branch by status */
  async findByStatusInBranch(branchId: Types.ObjectId | string, status: DeliveryStatus, opts?: ReadOptions): Promise<DeliveryDoc[]> {
    return this.findMany({ branch_id: branchId, status }, opts);
  }

  /** List deliveries without a route scheduled for a specific date */
  async findUnassignedForDate(branchId: Types.ObjectId | string, start: Date, end: Date, opts?: ReadOptions): Promise<DeliveryDoc[]> {
    return this.findMany(
      {
        branch_id: branchId,
        route_id: null,
        scheduled_for: { $gte: start, $lt: end },
      },
      { ...opts, sort: opts?.sort ?? { scheduled_for: 1, createdAt: 1 } }
    );
  }

  /** Search & paginate deliveries in a branch across delivery_no */
  async searchInBranch(
    branchId: Types.ObjectId | string,
    q: string | undefined,
    opts?: ReadOptions & { page?: number; pageSize?: number }
  ): Promise<PaginateResult<DeliveryDoc>> {
    const filter: any = { branch_id: branchId };
    if (q && q.trim()) {
      const s = q.trim();
      const rx = new RegExp(s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
      filter.delivery_no = rx;
    }
    return this.paginate(filter, { ...opts, sort: opts?.sort ?? { createdAt: -1 } });
  }

  /** Update delivery status */
  async setStatus(deliveryId: Types.ObjectId | string, status: DeliveryStatus, opts?: WriteOptions): Promise<DeliveryDoc | null> {
    return (this as any).model.findByIdAndUpdate(deliveryId, { $set: { status } }, { new: true, session: opts?.session ?? undefined }).exec();
  }

  /** Append an event to the delivery */
  async addEvent(
    deliveryId: Types.ObjectId | string,
    event: { type: string; at?: Date; data?: any },
    opts?: WriteOptions
  ): Promise<DeliveryDoc | null> {
    const evt = { ...event };
    if (!evt.at) evt.at = new Date();
    return (this as any).model.findByIdAndUpdate(deliveryId, { $push: { events: evt } }, { new: true, session: opts?.session ?? undefined }).exec();
  }

  /** Set delivery proof */
  async setProof(deliveryId: Types.ObjectId | string, proof: NonNullable<IDelivery["proof"]>, opts?: WriteOptions): Promise<DeliveryDoc | null> {
    return (this as any).model.findByIdAndUpdate(deliveryId, { $set: { proof } }, { new: true, session: opts?.session ?? undefined }).exec();
  }
}

// Optional singleton
export const deliveryRepository = new DeliveryRepository();
