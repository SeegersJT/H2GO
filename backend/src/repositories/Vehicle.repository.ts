import type { Model, HydratedDocument } from "mongoose";
import { Types } from "mongoose";
import VehicleModel from "../models/Vehicle.model";
import type { IVehicle } from "../models/Vehicle.model";
import { GenericRepository, ReadOptions, WriteOptions, PaginateResult } from "./Generic.repository";

export type VehicleDoc = HydratedDocument<IVehicle>;

export class VehicleRepository extends GenericRepository<IVehicle, VehicleDoc> {
  constructor(model: Model<IVehicle, any, any, any, VehicleDoc> = VehicleModel as any) {
    super(model);
  }

  async findByVehicleNo(vehicleNo: string, opts?: ReadOptions): Promise<VehicleDoc | null> {
    return this.findOne({ vehicle_no: vehicleNo }, opts);
  }

  async findByRegNumber(reg: string, opts?: ReadOptions): Promise<VehicleDoc | null> {
    return this.findOne({ reg_number: reg }, opts);
  }

  async findByBranch(branchId: Types.ObjectId | string, opts?: ReadOptions): Promise<VehicleDoc[]> {
    return this.findMany({ branch_id: branchId }, opts);
  }

  async searchInBranch(
    branchId: Types.ObjectId | string,
    q: string | undefined,
    opts?: ReadOptions & { page?: number; pageSize?: number }
  ): Promise<PaginateResult<VehicleDoc>> {
    const filter: any = { branch_id: branchId };
    if (q && q.trim()) {
      const rx = new RegExp(q.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
      filter.$or = [{ vehicle_no: rx }, { reg_number: rx }];
    }
    return this.paginate(filter, { ...opts, sort: opts?.sort ?? { createdAt: -1 } });
  }

  async setActive(vehicleId: Types.ObjectId | string, active: boolean, opts?: WriteOptions): Promise<VehicleDoc | null> {
    return (this as any).model.findByIdAndUpdate(vehicleId, { $set: { active } }, { new: true, session: opts?.session ?? undefined }).exec();
  }
}

export const vehicleRepository = new VehicleRepository();
