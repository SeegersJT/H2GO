import type { Model, HydratedDocument } from "mongoose";
import { Types } from "mongoose";
import DriverModel from "../models/Driver.model";
import type { IDriver } from "../models/Driver.model";
import { GenericRepository, ReadOptions, WriteOptions, PaginateResult } from "./Generic.repository";

export type DriverDoc = HydratedDocument<IDriver>;

export class DriverRepository extends GenericRepository<IDriver, DriverDoc> {
  constructor(model: Model<IDriver, any, any, any, DriverDoc> = DriverModel as any) {
    super(model);
  }

  async findByDriverNo(driverNo: string, opts?: ReadOptions): Promise<DriverDoc | null> {
    return this.findOne({ driver_no: driverNo }, opts);
  }

  async findByUser(userId: Types.ObjectId | string, opts?: ReadOptions): Promise<DriverDoc | null> {
    return this.findOne({ user_id: userId }, opts);
  }

  async findByBranch(branchId: Types.ObjectId | string, opts?: ReadOptions): Promise<DriverDoc[]> {
    return this.findMany({ branch_id: branchId }, opts);
  }

  /** Search drivers in branch by name or code */
  async searchInBranch(
    branchId: Types.ObjectId | string,
    q: string | undefined,
    opts?: ReadOptions & { page?: number; pageSize?: number }
  ): Promise<PaginateResult<DriverDoc>> {
    const filter: any = { branch_id: branchId };
    if (q && q.trim()) {
      const rx = new RegExp(q.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
      filter.$or = [{ driver_no: rx }, { phone: rx }];
    }
    return this.paginate(filter, { ...opts, sort: opts?.sort ?? { createdAt: -1 } });
  }

  async setActive(driverId: Types.ObjectId | string, active: boolean, opts?: WriteOptions): Promise<DriverDoc | null> {
    return (this as any).model.findByIdAndUpdate(driverId, { $set: { active } }, { new: true, session: opts?.session ?? undefined }).exec();
  }
}

export const driverRepository = new DriverRepository();
