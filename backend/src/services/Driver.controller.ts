import { Types } from "mongoose";
import { driverRepository } from "../repositories/Driver.repository";
import { IDriver } from "../models/Driver.model";

export class DriverService {
  static getAll() {
    return driverRepository.findMany({});
  }

  static getById(id: string) {
    return driverRepository.findById(new Types.ObjectId(id));
  }

  static insertDriver(data: Partial<IDriver>, actorId: string) {
    return driverRepository.create(data, actorId ? { actorId: new Types.ObjectId(actorId) } : undefined);
  }

  static updateDriver(id: string, data: Partial<IDriver>, actorId: string) {
    const driver = this.getById(id);
    if (!driver) {
      throw new Error("Invalid or inactive driver");
    }

    return driverRepository.updateById(new Types.ObjectId(id), data, actorId ? { actorId: new Types.ObjectId(actorId) } : undefined);
  }

  static deleteDriver(id: string, actorId: string) {
    const driver = this.getById(id);
    if (!driver) {
      throw new Error("Invalid or inactive driver");
    }

    return driverRepository.updateById(new Types.ObjectId(id), { active: false }, actorId ? { actorId: new Types.ObjectId(actorId) } : undefined);
  }
}
