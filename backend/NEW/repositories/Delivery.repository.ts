import BaseRepository from "./Base.repository";
import Delivery from "../models/Delivery.model";
import { IDelivery } from "../types/delivery";

class DeliveryRepository extends BaseRepository<IDelivery> {
  listForDriver(driverId: string, from?: Date, to?: Date) {
    const filter: any = { driver: driverId };
    if (from || to) filter.plannedAt = { ...(from ? { $gte: from } : {}), ...(to ? { $lte: to } : {}) };
    return this.find(filter, { lean: true, sort: { plannedAt: 1 } });
  }
  listForCustomer(customerId: string, limit = 50) {
    return this.find({ customer: customerId } as any, { lean: true, sort: { plannedAt: -1 }, limit });
  }
}

export default new DeliveryRepository(Delivery);
