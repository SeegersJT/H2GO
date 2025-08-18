import { Types } from "mongoose";
import { RouteDoc, routeRepository } from "../repositories/Route.repository";
import { DeliveryDoc, deliveryRepository } from "../repositories/Delivery.repository";
import { SubscriptionDoc, subscriptionRepository } from "../repositories/Subscription.repository";
import dayjs from "dayjs";
import { IRoute } from "../models/Route.model";

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

  static async generateForDay(
    branchId: string,
    routeDate: Date,
    vehicleId: string,
    driverId: string,
    notes: string,
    actorId: string
  ): Promise<{ route: RouteDoc; deliveries: DeliveryDoc[] }> {
    const start = new Date(routeDate);
    start.setHours(0, 0, 0, 0);
    const end = new Date(start);
    end.setDate(start.getDate() + 1);

    return routeRepository.runInTransaction(async (session) => {
      const route = await routeRepository.create(
        {
          branch_id: new Types.ObjectId(branchId),
          date: start,
          vehicle_id: new Types.ObjectId(vehicleId),
          driver_id: new Types.ObjectId(driverId),
          notes,
        },
        { actorId: new Types.ObjectId(actorId), session }
      );

      const subscriptions = await subscriptionRepository.findMany({ branch_id: new Types.ObjectId(branchId), status: "active" }, { session });

      const occursOn = (sub: SubscriptionDoc): boolean => {
        const parts = Object.fromEntries(sub.rrule.split(";").map((p) => p.split("=")));
        if (parts.FREQ !== "WEEKLY") return false;
        const bydays = (parts.BYDAY ?? "").split(",").filter(Boolean);
        const interval = parseInt(parts.INTERVAL ?? "1", 10);
        const anchor = dayjs(sub.anchor_date).startOf("day");
        const target = dayjs(start);
        const dayNames = ["SU", "MO", "TU", "WE", "TH", "FR", "SA"];
        const dayCode = dayNames[target.day()];
        if (!bydays.includes(dayCode)) return false;
        const diffWeeks = target.diff(anchor, "week");
        return diffWeeks >= 0 && diffWeeks % interval === 0;
      };

      let sequence = 1;
      const deliveries: DeliveryDoc[] = [];

      for (const sub of subscriptions) {
        if (occursOn(sub)) {
          const delivery = await deliveryRepository.create(
            {
              route_id: route._id,
              branch_id: sub.branch_id,
              user_id: sub.user_id,
              address_id: sub.address_id,
              items: sub.items.map((i) => ({
                product_id: i.product_id,
                name: i.name,
                quantity: i.quantity,
                unit_price: i.unit_price ?? 0,
              })),
              sequence: sequence++,
              window_start: sub.desired_window?.start,
              window_end: sub.desired_window?.end,
              source: "subscription",
              status: "scheduled",
            },
            { actorId: new Types.ObjectId(actorId), session }
          );
          deliveries.push(delivery);
        }
      }

      return { route, deliveries };
    });
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
