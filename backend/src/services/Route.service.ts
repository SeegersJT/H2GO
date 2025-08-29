import { Types } from "mongoose";
import { RouteDoc, routeRepository } from "../repositories/Route.repository";
import { DeliveryDoc, deliveryRepository } from "../repositories/Delivery.repository";
import { SubscriptionDoc, subscriptionRepository } from "../repositories/Subscription.repository";
import dayjs from "dayjs";
import { IRoute } from "../models/Route.model";
import { addressRepository } from "../repositories/Address.repository";
import { HttpError } from "../utils/HttpError";
import { StatusCode } from "../utils/constants/StatusCode.constant";

export class RouteService {
  static getAll() {
    return routeRepository.findMany({});
  }

  static getById(id: string) {
    return routeRepository.findById(new Types.ObjectId(id));
  }

  static async getByDriverAndDate(driverId: string, day: Date) {
    const route = await routeRepository.findByDriverAndDate(new Types.ObjectId(driverId), day);
    if (!route) {
      throw new HttpError("No route has been generated for this driver.", StatusCode.NOT_FOUND);
    }

    const deliveries = await deliveryRepository.findByRoute(route.id);
    return {
      route: {
        ...route.toJSON(),
      },
      deliveries: deliveries.map((d) => d.toJSON()),
    };
  }

  static insertRoute(data: Partial<IRoute>, actorId: string) {
    return routeRepository.create(data, { actorId: new Types.ObjectId(actorId) });
  }

  static async generateForDay(
    branchId: string,
    routeDate: Date,
    vehicleId: string,
    driverId: string,
    notes: string,
    actorId: string,
    opts?: { subscription_ids?: string[]; suburb?: string; city?: string; region?: string }
  ): Promise<{ route: RouteDoc; deliveries: DeliveryDoc[] }> {
    const start = new Date(routeDate);
    start.setHours(0, 0, 0, 0);
    const end = new Date(start);
    end.setDate(start.getDate() + 1);

    const existing = await routeRepository.findByDriverAndDate(new Types.ObjectId(driverId), start);
    if (existing) {
      return routeRepository.runInTransaction(async (session) => {
        const current = await deliveryRepository.findByRoute(existing.id, { session });
        let sequence = current.length + 1;
        const unassigned = await deliveryRepository.findUnassignedForDate(new Types.ObjectId(branchId), start, end, { session });
        const added: DeliveryDoc[] = [];
        for (const d of unassigned) {
          const updated = await deliveryRepository.updateById(
            d._id,
            { route_id: existing._id as any, sequence: sequence++ },
            { actorId: new Types.ObjectId(actorId), session }
          );
          if (updated) added.push(updated);
        }
        return { route: existing, deliveries: current.concat(added) };
      });
    }

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

      const subFilter: any = { branch_id: new Types.ObjectId(branchId), status: "active" };
      if (opts?.subscription_ids?.length) {
        subFilter._id = { $in: opts.subscription_ids.map((id) => new Types.ObjectId(id)) };
      }

      let subscriptions = await subscriptionRepository.findMany(subFilter, { session });

      if (opts?.suburb || opts?.city || opts?.region) {
        const addressIds = subscriptions.map((s) => s.address_id);
        const addresses = await addressRepository.findMany({ _id: { $in: addressIds } }, { session });
        const map = new Map(addresses.map((a) => [String(a._id), a]));
        subscriptions = subscriptions.filter((s) => {
          const addr = map.get(String(s.address_id));
          if (!addr) return false;
          if (opts.suburb && addr.suburb !== opts.suburb) return false;
          if (opts.city && addr.city !== opts.city) return false;
          if (opts.region && addr.region !== opts.region) return false;
          return true;
        });
      }

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
                unit_price: i.billing_period === "monthly" ? 0 : (i.unit_price ?? 0),
              })),
              sequence: sequence++,
              scheduled_for: start,
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

      const unassigned = await deliveryRepository.findUnassignedForDate(new Types.ObjectId(branchId), start, end, { session });

      for (const d of unassigned) {
        const updated = await deliveryRepository.updateById(
          d._id,
          { route_id: route._id, sequence: sequence++ },
          { actorId: new Types.ObjectId(actorId), session }
        );
        if (updated) deliveries.push(updated);
      }

      return { route, deliveries };
    });
  }

  static updateRoute(id: string, data: Partial<IRoute>, actorId: string) {
    const route = this.getById(id);
    if (!route) {
      throw new HttpError("Invalid or inactive route", StatusCode.NOT_FOUND);
    }

    return routeRepository.updateById(new Types.ObjectId(id), data, { actorId: new Types.ObjectId(actorId) });
  }

  static deleteRoute(id: string, actorId: string) {
    const route = this.getById(id);
    if (!route) {
      throw new HttpError("Invalid or inactive route", StatusCode.NOT_FOUND);
    }

    return routeRepository.updateById(new Types.ObjectId(id), { active: false }, { actorId: new Types.ObjectId(actorId) });
  }
}
