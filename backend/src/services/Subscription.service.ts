import { Types } from "mongoose";
import { subscriptionRepository } from "../repositories/Subscription.repository";

export class SubscriptionService {
  static getAll() {
    return subscriptionRepository.findMany({});
  }

  static getById(id: string) {
    return subscriptionRepository.findById(new Types.ObjectId(id));
  }

  static create(data: any) {
    return subscriptionRepository.create(data);
  }

  static update(id: string, data: any) {
    return subscriptionRepository.updateById(new Types.ObjectId(id), data);
  }

  static delete(id: string) {
    return subscriptionRepository.deleteById(new Types.ObjectId(id));
  }
}
