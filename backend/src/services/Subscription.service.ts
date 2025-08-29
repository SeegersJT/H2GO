import { Types } from "mongoose";
import { subscriptionRepository } from "../repositories/Subscription.repository";
import { ISubscription } from "../models/Subscription.model";
import { HttpError } from "../utils/HttpError";
import { StatusCode } from "../utils/constants/StatusCode.constant";

export class SubscriptionService {
  static getAll() {
    return subscriptionRepository.findMany({});
  }

  static getById(id: string) {
    return subscriptionRepository.findById(new Types.ObjectId(id));
  }

  static insertSubscription(data: Partial<ISubscription>, actorId: string) {
    return subscriptionRepository.create(data, { actorId: new Types.ObjectId(actorId) });
  }

  static updateSubscription(id: string, data: Partial<ISubscription>, actorId: string) {
    const subscription = this.getById(id);
    if (!subscription) {
      throw new HttpError("Invalid or inactive subscription", StatusCode.NOT_FOUND);
    }

    return subscriptionRepository.updateById(new Types.ObjectId(id), data, { actorId: new Types.ObjectId(actorId) });
  }

  static deleteSubscription(id: string, actorId: string) {
    const subscription = this.getById(id);
    if (!subscription) {
      throw new HttpError("Invalid or inactive subscription", StatusCode.NOT_FOUND);
    }

    return subscriptionRepository.updateById(new Types.ObjectId(id), { status: "cancelled" }, { actorId: new Types.ObjectId(actorId) });
  }
}
