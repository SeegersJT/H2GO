import { Types } from "mongoose";
import { orderRepository } from "../repositories/Order.repository";
import { IOrder } from "../models/Order.model";

export class OrderService {
  static getAll() {
    return orderRepository.findMany({});
  }

  static getById(id: string) {
    return orderRepository.findById(new Types.ObjectId(id));
  }

  static insertOrder(data: Partial<IOrder>, actorId?: string) {
    return orderRepository.create(data, actorId ? { actorId: new Types.ObjectId(actorId) } : undefined);
  }

  static updateOrder(id: string, data: Partial<IOrder>, actorId?: string) {
    const order = this.getById(id);
    if (!order) {
      throw new Error("Invalid or inactive order");
    }

    return orderRepository.updateById(new Types.ObjectId(id), data, actorId ? { actorId: new Types.ObjectId(actorId) } : undefined);
  }

  static deleteOrder(id: string, actorId?: string) {
    const order = this.getById(id);
    if (!order) {
      throw new Error("Invalid or inactive order");
    }

    return orderRepository.updateById(
      new Types.ObjectId(id),
      { status: "cancelled" },
      actorId ? { actorId: new Types.ObjectId(actorId) } : undefined
    );
  }
}
