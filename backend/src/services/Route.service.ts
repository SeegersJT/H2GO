import { Types } from "mongoose";
import { routeRepository } from "../repositories/Route.repository";

export class RouteService {
  static getAll() {
    return routeRepository.findMany({});
  }

  static getById(id: string) {
    return routeRepository.findById(new Types.ObjectId(id));
  }

  static create(data: any) {
    return routeRepository.create(data);
  }

  static update(id: string, data: any) {
    return routeRepository.updateById(new Types.ObjectId(id), data);
  }

  static delete(id: string) {
    return routeRepository.deleteById(new Types.ObjectId(id));
  }
}
