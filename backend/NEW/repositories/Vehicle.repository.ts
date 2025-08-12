import BaseRepository from "./Base.repository";
import Vehicle from "../models/Vehicle.model";
import { IVehicle } from "../types/location";

class VehicleRepository extends BaseRepository<IVehicle> {
  listActiveByBranch(branchId: string) {
    return this.find({ branch: branchId, isActive: true } as any, { lean: true, sort: { regNumber: 1 } });
  }
}

export default new VehicleRepository(Vehicle);
