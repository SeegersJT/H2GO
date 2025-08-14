import { Types } from "mongoose";
import { deliveryRepository } from "../repositories/Delivery.repository";

export class DeliveryService {
  static getAll() {
    return deliveryRepository.findMany({});
  }

  static getById(id: string) {
    return deliveryRepository.findById(new Types.ObjectId(id));
  }

  static create(data: any) {
    return deliveryRepository.create(data);
  }

  static update(id: string, data: any) {
    return deliveryRepository.updateById(new Types.ObjectId(id), data);
  }

  static delete(id: string) {
    return deliveryRepository.deleteById(new Types.ObjectId(id));
  }
}
