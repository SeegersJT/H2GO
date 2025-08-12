import BaseRepository from "./Base.repository";
import DeliverySchedule from "../models/DeliverySchedule.model";
import { IDeliverySchedule } from "../types/delivery";

class DeliveryScheduleRepository extends BaseRepository<IDeliverySchedule> {
  listDue(now = new Date()) {
    return this.find({ isActive: true, nextRunAt: { $lte: now } } as any, { lean: true, sort: { nextRunAt: 1 } });
  }
}

export default new DeliveryScheduleRepository(DeliverySchedule);
