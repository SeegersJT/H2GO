import { Types } from "mongoose";
import { deliveryRepository } from "../repositories/Delivery.repository";
import { IDelivery } from "../models/Delivery.model";

export class DeliveryService {
  static getAll() {
    return deliveryRepository.findMany({});
  }

  static getById(id: string) {
    return deliveryRepository.findById(new Types.ObjectId(id));
  }

  static create(data: Partial<IDelivery>, actorId: string) {
    return deliveryRepository.create(data, actorId ? { actorId: new Types.ObjectId(actorId) } : undefined);
  }

  static update(id: string, data: Partial<IDelivery>, actorId: string) {
    const delivery = this.getById(id);
    if (!delivery) {
      throw new Error("Invalid or inactive delivery");
    }

    return deliveryRepository.updateById(new Types.ObjectId(id), data, actorId ? { actorId: new Types.ObjectId(actorId) } : undefined);
  }

  static delete(id: string, actorId: string) {
    const delivery = this.getById(id);
    if (!delivery) {
      throw new Error("Invalid or inactive delivery");
    }

    return deliveryRepository.updateById(new Types.ObjectId(id), { active: false }, actorId ? { actorId: new Types.ObjectId(actorId) } : undefined);
  }
}
