import { Types } from "mongoose";
import { driverRepository } from "../repositories/Driver.repository";
import { IDriver } from "../models/Driver.model";
import { HttpError } from "../utils/HttpError";
import { StatusCode } from "../utils/constants/StatusCode.constant";

export class DriverService {
  static getAll() {
    return driverRepository.findMany({});
  }

  static getById(id: string) {
    return driverRepository.findById(new Types.ObjectId(id));
  }

  static insertDriver(data: Partial<IDriver>, actorId: string) {
    return driverRepository.create(data, { actorId: new Types.ObjectId(actorId) });
  }

  static updateDriver(id: string, data: Partial<IDriver>, actorId: string) {
    const driver = this.getById(id);
    if (!driver) {
      throw new HttpError("Invalid or inactive driver", StatusCode.NOT_FOUND);
    }

    return driverRepository.updateById(new Types.ObjectId(id), data, { actorId: new Types.ObjectId(actorId) });
  }

  static deleteDriver(id: string, actorId: string) {
    const driver = this.getById(id);
    if (!driver) {
      throw new HttpError("Invalid or inactive driver", StatusCode.NOT_FOUND);
    }

    return driverRepository.updateById(new Types.ObjectId(id), { active: false }, { actorId: new Types.ObjectId(actorId) });
  }
}
