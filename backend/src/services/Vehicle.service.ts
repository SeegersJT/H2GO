import { Types } from "mongoose";
import { vehicleRepository } from "../repositories/Vehicle.repository";
import { IVehicle } from "../models/Vehicle.model";

export class VehicleService {
  static getAll() {
    return vehicleRepository.findMany({});
  }

  static getById(id: string) {
    return vehicleRepository.findById(new Types.ObjectId(id));
  }

  static insertVehicle(data: Partial<IVehicle>, actorId: string) {
    return vehicleRepository.create(data, { actorId: new Types.ObjectId(actorId) });
  }

  static updateVehicle(id: string, data: Partial<IVehicle>, actorId: string) {
    const vehicle = this.getById(id);
    if (!vehicle) {
      throw new Error("Invalid or inactive vehicle");
    }

    return vehicleRepository.updateById(new Types.ObjectId(id), data, { actorId: new Types.ObjectId(actorId) });
  }

  static deleteVehicle(id: string, actorId: string) {
    const vehicle = this.getById(id);
    if (!vehicle) {
      throw new Error("Invalid or inactive vehicle");
    }

    return vehicleRepository.updateById(new Types.ObjectId(id), { active: false }, { actorId: new Types.ObjectId(actorId) });
  }
}
