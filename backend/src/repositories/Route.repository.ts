import type { Model, HydratedDocument } from "mongoose";
import { Types } from "mongoose";
import RouteModel from "../models/Route.model";
import type { IRoute, RouteStatus } from "../models/Route.model";
import { GenericRepository, PaginateResult, ReadOptions, WriteOptions } from "./Generic.repository";

export type RouteDoc = HydratedDocument<IRoute>;

export class RouteRepository extends GenericRepository<IRoute, RouteDoc> {
  constructor(model: Model<IRoute, any, any, any, RouteDoc> = RouteModel as any) {
    super(model);
  }

  /** Find by human route code (route_no) */
  async findByRouteNo(routeNo: string, opts?: ReadOptions): Promise<RouteDoc | null> {
    return this.findOne({ route_no: routeNo }, opts);
  }

  /** List routes in a branch */
  async findByBranch(branchId: Types.ObjectId | string, opts?: ReadOptions): Promise<RouteDoc[]> {
    return this.findMany({ branch_id: branchId }, opts);
  }

  /** List routes assigned to a driver */
  async findByDriver(driverId: Types.ObjectId | string, opts?: ReadOptions): Promise<RouteDoc[]> {
    return this.findMany({ driver_id: driverId }, opts);
  }

  /** List routes assigned to a vehicle */
  async findByVehicle(vehicleId: Types.ObjectId | string, opts?: ReadOptions): Promise<RouteDoc[]> {
    return this.findMany({ vehicle_id: vehicleId }, opts);
  }

  /** List routes in a branch within a date range (inclusive start, exclusive end) */
  async findByDateRangeInBranch(branchId: Types.ObjectId | string, start: Date, end: Date, opts?: ReadOptions): Promise<RouteDoc[]> {
    const filter = { branch_id: branchId, date: { $gte: start, $lt: end } };
    return this.findMany(filter, { ...opts, sort: opts?.sort ?? { date: 1 } });
  }

  /** List routes in a branch by status */
  async findByStatusInBranch(branchId: Types.ObjectId | string, status: RouteStatus, opts?: ReadOptions): Promise<RouteDoc[]> {
    return this.findMany({ branch_id: branchId, status }, opts);
  }

  /** Search & paginate routes in a branch across route_no and notes */
  async searchInBranch(
    branchId: Types.ObjectId | string,
    q: string | undefined,
    opts?: ReadOptions & { page?: number; pageSize?: number }
  ): Promise<PaginateResult<RouteDoc>> {
    const filter: any = { branch_id: branchId };
    if (q && q.trim()) {
      const s = q.trim();
      const rx = new RegExp(s.replace(/[.*+?^${}()|[\\]\\]/g, "\\$&"), "i");
      filter.$or = [{ route_no: rx }, { notes: rx }];
    }
    return this.paginate(filter, { ...opts, sort: opts?.sort ?? { date: -1, createdAt: -1 } });
  }

  /** Update route status */
  async setStatus(routeId: Types.ObjectId | string, status: RouteStatus, opts?: WriteOptions): Promise<RouteDoc | null> {
    return (this as any).model.findByIdAndUpdate(routeId, { $set: { status } }, { new: true, session: opts?.session ?? undefined }).exec();
  }

  /** Assign or clear vehicle */
  async setVehicle(routeId: Types.ObjectId | string, vehicleId: Types.ObjectId | string | null, opts?: WriteOptions): Promise<RouteDoc | null> {
    return (this as any).model
      .findByIdAndUpdate(routeId, { $set: { vehicle_id: vehicleId } }, { new: true, session: opts?.session ?? undefined })
      .exec();
  }

  /** Assign or clear driver */
  async setDriver(routeId: Types.ObjectId | string, driverId: Types.ObjectId | string | null, opts?: WriteOptions): Promise<RouteDoc | null> {
    return (this as any).model
      .findByIdAndUpdate(routeId, { $set: { driver_id: driverId } }, { new: true, session: opts?.session ?? undefined })
      .exec();
  }
}

// Optional singleton
export const routeRepository = new RouteRepository();
