import { Types } from "mongoose";
import { orderRepository } from "../repositories/Order.repository";
import { IOrder } from "../models/Order.model";
import dayjs from "dayjs";
import { subscriptionRepository } from "../repositories/Subscription.repository";
import { priceListRepository } from "../repositories/PriceList.repository";
import { productRepository } from "../repositories/Product.repository";

export class OrderService {
  static getAll() {
    return orderRepository.findMany({});
  }

  static getById(id: string) {
    return orderRepository.findById(new Types.ObjectId(id));
  }

  static getByDate(branchId: string, startDate: Date, endDate: Date) {
    return orderRepository.findByDateRangeInBranch(new Types.ObjectId(branchId), startDate, endDate);
  }

  static insertOrder(data: Partial<IOrder>, actorId?: string) {
    return orderRepository.create(data, actorId ? { actorId: new Types.ObjectId(actorId) } : undefined);
  }

  static updateOrder(id: string, data: Partial<IOrder>, actorId?: string) {
    const order = this.getById(id);
    if (!order) {
      throw new Error("Invalid or inactive order");
    }

    return orderRepository.updateById(new Types.ObjectId(id), data, actorId ? { actorId: new Types.ObjectId(actorId) } : undefined);
  }

  static deleteOrder(id: string, actorId?: string) {
    const order = this.getById(id);
    if (!order) {
      throw new Error("Invalid or inactive order");
    }

    return orderRepository.updateById(
      new Types.ObjectId(id),
      { status: "cancelled" },
      actorId ? { actorId: new Types.ObjectId(actorId) } : undefined
    );
  }

  static async generateForDate(desiredDate: Date, actorId?: string) {
    const start = dayjs(desiredDate).startOf("day").toDate();
    const subs = await subscriptionRepository.findMany({ status: "active" });
    const created: IOrder[] = [];

    function occursOn(rrule: string, anchor: Date, target: Date): boolean {
      const parts = Object.fromEntries(rrule.split(";").map((p) => p.split("=")));
      const freq = parts["FREQ"];
      const interval = parseInt(parts["INTERVAL"] || "1", 10);
      if (freq === "DAILY") {
        const diff = dayjs(target).startOf("day").diff(dayjs(anchor).startOf("day"), "day");
        return diff >= 0 && diff % interval === 0;
      }
      if (freq === "WEEKLY") {
        const diff = dayjs(target).startOf("week").diff(dayjs(anchor).startOf("week"), "week");
        if (diff < 0 || diff % interval !== 0) return false;
        const byday = (parts["BYDAY"] || "").split(",");
        const weekday = ["SU", "MO", "TU", "WE", "TH", "FR", "SA"][dayjs(target).day()];
        return byday.includes(weekday);
      }
      return false;
    }

    for (const sub of subs) {
      if (!occursOn(sub.rrule, sub.anchor_date, start)) continue;

      const items = [] as IOrder["items"];
      for (const it of sub.items) {
        const priceInfo = await priceListRepository.getEffectivePrice({
          branchId: sub.branch_id,
          productId: it.product_id,
          quantity: it.quantity,
          userId: sub.user_id,
          onDate: start,
        });
        let unitPrice = priceInfo?.price;
        if (unitPrice == null) {
          const prod = await productRepository.findById(it.product_id);
          unitPrice = prod?.default_price ?? 0;
        }
        items.push({
          product_id: it.product_id as any,
          name: it.name,
          quantity: it.quantity,
          unit_price: unitPrice,
        });
      }

      const subtotal = items.reduce((sum, i) => sum + i.quantity * i.unit_price, 0);
      const order = await orderRepository.create(
        {
          branch_id: sub.branch_id,
          user_id: sub.user_id,
          address_id: sub.address_id,
          items,
          desired_date: start,
          window_start: sub.desired_window?.start,
          window_end: sub.desired_window?.end,
          source: "subscription",
          status: "confirmed",
          totals: { subtotal, total: subtotal, currency: "ZAR" },
        },
        actorId ? { actorId: new Types.ObjectId(actorId) } : undefined
      );
      created.push(order);
    }

    return created;
  }
}
