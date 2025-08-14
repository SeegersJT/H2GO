import { Types } from "mongoose";
import { orderRepository } from "../repositories/Order.repository";

export class OrderService {
  static getAll() {
    return orderRepository.findMany({});
  }

  static getById(id: string) {
    return orderRepository.findById(new Types.ObjectId(id));
  }

  static create(data: any) {
    return orderRepository.create(data);
  }

  static update(id: string, data: any) {
    return orderRepository.updateById(new Types.ObjectId(id), data);
  }

  static delete(id: string) {
    return orderRepository.deleteById(new Types.ObjectId(id));
  }
}
