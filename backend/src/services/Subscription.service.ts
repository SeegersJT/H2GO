import { Types } from "mongoose";
import { subscriptionRepository } from "../repositories/Subscription.repository";
import { ISubscription } from "../models/Subscription.model";

export class SubscriptionService {
  static getAll() {
    return subscriptionRepository.findMany({});
  }

  static getById(id: string) {
    return subscriptionRepository.findById(new Types.ObjectId(id));
  }

  static insertSubscription(data: Partial<ISubscription>, actorId?: string) {
    return subscriptionRepository.create(data, actorId ? { actorId: new Types.ObjectId(actorId) } : undefined);
  }

  static updateSubscription(id: string, data: Partial<ISubscription>, actorId?: string) {
    const subscription = this.getById(id);
    if (!subscription) {
      throw new Error("Invalid or inactive subscription");
    }

    return subscriptionRepository.updateById(new Types.ObjectId(id), data, actorId ? { actorId: new Types.ObjectId(actorId) } : undefined);
  }

  static deleteSubscription(id: string, actorId?: string) {
    const subscription = this.getById(id);
    if (!subscription) {
      throw new Error("Invalid or inactive subscription");
    }

    return subscriptionRepository.updateById(
      new Types.ObjectId(id),
      { status: "cancelled" },
      actorId ? { actorId: new Types.ObjectId(actorId) } : undefined
    );
  }
}
