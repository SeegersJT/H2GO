import { Types } from "mongoose";
import { routeRepository } from "../repositories/Route.repository";
import { IRoute } from "express";

export class RouteService {
  static getAll() {
    return routeRepository.findMany({});
  }

  static getById(id: string) {
    return routeRepository.findById(new Types.ObjectId(id));
  }

  static insertRoute(data: Partial<IRoute>, actorId: string) {
    return routeRepository.create(data, actorId ? { actorId: new Types.ObjectId(actorId) } : undefined);
  }

  static updateRoute(id: string, data: Partial<IRoute>, actorId: string) {
    const route = this.getById(id);
    if (!route) {
      throw new Error("Invalid or inactive route");
    }

    return routeRepository.updateById(new Types.ObjectId(id), data, actorId ? { actorId: new Types.ObjectId(actorId) } : undefined);
  }

  static deleteRoute(id: string, actorId: string) {
    const route = this.getById(id);
    if (!route) {
      throw new Error("Invalid or inactive route");
    }

    return routeRepository.updateById(new Types.ObjectId(id), { active: false }, actorId ? { actorId: new Types.ObjectId(actorId) } : undefined);
  }
}
