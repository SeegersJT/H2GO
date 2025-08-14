import { Types } from "mongoose";
import { driverRepository } from "../repositories/Driver.repository";

export class DriverService {
  static getAll() {
    return driverRepository.findMany({});
  }

  static getById(id: string) {
    return driverRepository.findById(new Types.ObjectId(id));
  }

  static create(data: any) {
    return driverRepository.create(data);
  }

  static update(id: string, data: any) {
    return driverRepository.updateById(new Types.ObjectId(id), data);
  }

  static delete(id: string) {
    return driverRepository.deleteById(new Types.ObjectId(id));
  }
}
