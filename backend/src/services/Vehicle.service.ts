import { Types } from "mongoose";
import { vehicleRepository } from "../repositories/Vehicle.repository";

export class VehicleService {
  static getAll() {
    return vehicleRepository.findMany({});
  }

  static getById(id: string) {
    return vehicleRepository.findById(new Types.ObjectId(id));
  }

  static create(data: any) {
    return vehicleRepository.create(data);
  }

  static update(id: string, data: any) {
    return vehicleRepository.updateById(new Types.ObjectId(id), data);
  }

  static delete(id: string) {
    return vehicleRepository.deleteById(new Types.ObjectId(id));
  }
}
