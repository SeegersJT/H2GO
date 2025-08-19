import { Types } from "mongoose";
import { invoiceRepository } from "../repositories/Invoice.repository";
import { IInvoice, IInvoiceLine } from "../models/Invoice.model";
import { subscriptionRepository } from "../repositories/Subscription.repository";
import dayjs from "dayjs";
import { ISubscription } from "../models/Subscription.model";
import { IDelivery } from "../models/Delivery.model";
import { deliveryRepository } from "../repositories/Delivery.repository";

export class InvoiceService {
  static getAll() {
    return invoiceRepository.findMany({});
  }

  static getById(id: string) {
    return invoiceRepository.findById(new Types.ObjectId(id));
  }

  static insertInvoice(data: Partial<IInvoice>, actorId: string) {
    return invoiceRepository.create(data, actorId ? { actorId: new Types.ObjectId(actorId) } : undefined);
  }

  static updateInvoice(id: string, data: Partial<IInvoice>, actorId: string) {
    return invoiceRepository.updateById(new Types.ObjectId(id), data, actorId ? { actorId: new Types.ObjectId(actorId) } : undefined);
  }

  static deleteInvoice(id: string, actorId: string) {
    return invoiceRepository.updateById(new Types.ObjectId(id), { active: false }, actorId ? { actorId: new Types.ObjectId(actorId) } : undefined);
  }

  /** Compute line and invoice totals. Mutates the line array to populate line_* fields. */
  private static calculateTotals(lines: IInvoiceLine[]): IInvoice["totals"] {
    let subtotal = 0;
    let tax = 0;
    lines.forEach((l) => {
      const lineSubtotal = l.quantity * l.unit_price;
      const lineTax = l.tax_rate ? (lineSubtotal * l.tax_rate) / 100 : 0;
      l.line_subtotal = lineSubtotal;
      l.line_tax = lineTax;
      l.line_total = lineSubtotal + lineTax;
      subtotal += lineSubtotal;
      tax += lineTax;
    });
    return { subtotal, tax, total: subtotal + tax };
  }

  /** Count how many deliveries are expected for a subscription within a date range. */
  private static countDeliveries(sub: ISubscription, start: Date, end: Date): number {
    const parts = Object.fromEntries(sub.rrule.split(";").map((p) => p.split("=")));
    if (parts.FREQ !== "WEEKLY") return 0;
    const bydays = (parts.BYDAY ?? "").split(",").filter(Boolean);
    const interval = parseInt(parts.INTERVAL ?? "1", 10);
    const anchor = dayjs(sub.anchor_date).startOf("day");
    const s = dayjs(start).startOf("day");
    const e = dayjs(end).startOf("day");
    let count = 0;
    const dayNames = ["SU", "MO", "TU", "WE", "TH", "FR", "SA"];
    for (let d = s; !d.isAfter(e); d = d.add(1, "day")) {
      const dayCode = dayNames[d.day()];
      if (!bydays.includes(dayCode)) continue;
      const diffWeeks = d.diff(anchor, "week");
      if (diffWeeks >= 0 && diffWeeks % interval === 0) count++;
    }
    return count;
  }

  /** Create an invoice for a manual delivery */
  private static async invoiceManualDelivery(delivery: IDelivery, issueDate: Date, dueDate: Date) {
    if (!delivery.items?.length) return null;
    const lines: IInvoiceLine[] = delivery.items.map((it) => ({
      product_id: it.product_id,
      description: it.name,
      quantity: it.quantity,
      unit_price: it.unit_price ?? 0,
      currency_code: "ZAR",
      tax_rate: undefined,
    }));
    const totals = this.calculateTotals(lines);
    return invoiceRepository.create({
      branch_id: delivery.branch_id as any,
      user_id: delivery.user_id as any,
      currency_code: lines[0]?.currency_code ?? "ZAR",
      lines,
      totals,
      status: "issued",
      issue_date: issueDate,
      due_date: dueDate,
      reference_type: "DELIVERY",
      reference_id: delivery._id as any,
    });
  }

  /** Generate invoices for all active subscriptions and manual deliveries. */
  static async generateInvoicesForEligibleUsers() {
    const start = dayjs().startOf("month").toDate();
    const end = dayjs().endOf("month").toDate();
    const subs = await subscriptionRepository.findMany({ status: "active" });
    const deliveries = await deliveryRepository.findMany({
      source: "manual",
      status: "delivered",
      scheduled_for: { $gte: start, $lte: end },
    });
    const invoices: IInvoice[] = [];

    for (const del of deliveries) {
      const issueDate = new Date();
      const dueDate = new Date(issueDate);
      dueDate.setDate(dueDate.getDate() + 30);
      const inv = await this.invoiceManualDelivery(del as any, issueDate, dueDate);
      if (inv) invoices.push(inv as any);
    }

    for (const sub of subs) {
      if (!sub.items?.length) continue;
      const multiplier = this.countDeliveries(sub as any, start, end);
      const lines: IInvoiceLine[] = sub.items
        .map((it) => ({
          product_id: it.product_id,
          description: it.name,
          quantity: it.quantity * (it.billing_period === "monthly" ? 1 : multiplier),
          unit_price: it.unit_price ?? 0,
          currency_code: (it as any).currency_code,
          tax_rate: undefined,
        }))
        .filter((l) => l.quantity > 0);
      if (!lines.length) continue;
      const totals = this.calculateTotals(lines);
      const issueDate = new Date();
      const dueDate = new Date(issueDate);
      dueDate.setDate(dueDate.getDate() + 30);
      const invoice = await invoiceRepository.create({
        branch_id: sub.branch_id as any,
        user_id: sub.user_id as any,
        currency_code: lines[0]?.currency_code ?? "ZAR",
        lines,
        totals,
        status: "issued",
        issue_date: issueDate,
        due_date: dueDate,
      });
      invoices.push(invoice as any);
    }
    return invoices;
  }

  /** Generate invoices for the current month. Delegates to eligible user generator. */
  static async generateCurrentMonthInvoices() {
    return this.generateInvoicesForEligibleUsers();
  }

  /** Find invoices that are due for payment (status issued/partially_paid and due_date in past). */
  static async generatePaymentsDueInvoices() {
    const now = new Date();
    return invoiceRepository.findMany({
      status: { $in: ["issued", "partially_paid"] },
      due_date: { $lte: now },
    });
  }

  /** Generate current month's invoice for a single user. */
  static async generateCurrentMonthInvoiceForUser(userId: string) {
    const subs = await subscriptionRepository.findByUser(new Types.ObjectId(userId));
    const start = dayjs().startOf("month").toDate();
    const end = dayjs().endOf("month").toDate();
    const deliveries = await deliveryRepository.findMany({
      user_id: new Types.ObjectId(userId),
      source: "manual",
      status: "delivered",
      scheduled_for: { $gte: start, $lte: end },
    });
    const invoices: IInvoice[] = [];
    for (const del of deliveries) {
      const issueDate = new Date();
      const dueDate = new Date(issueDate);
      dueDate.setDate(dueDate.getDate() + 30);
      const inv = await this.invoiceManualDelivery(del as any, issueDate, dueDate);
      if (inv) invoices.push(inv as any);
    }
    for (const sub of subs) {
      if (!sub.items?.length) continue;
      const multiplier = this.countDeliveries(sub as any, start, end);
      const lines: IInvoiceLine[] = sub.items
        .map((it) => ({
          product_id: it.product_id,
          description: it.name,
          quantity: it.quantity * (it.billing_period === "monthly" ? 1 : multiplier),
          unit_price: it.unit_price ?? 0,
          currency_code: (it as any).currency_code,
          tax_rate: undefined,
        }))
        .filter((l) => l.quantity > 0);
      if (!lines.length) continue;
      const totals = this.calculateTotals(lines);
      const issueDate = new Date();
      const dueDate = new Date(issueDate);
      dueDate.setDate(dueDate.getDate() + 30);
      const invoice = await invoiceRepository.create({
        branch_id: sub.branch_id as any,
        user_id: sub.user_id as any,
        currency_code: lines[0]?.currency_code ?? "ZAR",
        lines,
        totals,
        status: "issued",
        issue_date: issueDate,
        due_date: dueDate,
      });
      invoices.push(invoice as any);
    }
    return { userId, invoices };
  }

  /** Generate invoices for all active subscriptions and manual deliveries within a custom date range. */
  static async generateInvoicesByDateRange(start: Date, end: Date) {
    const subs = await subscriptionRepository.findMany({ status: "active" });
    const deliveries = await deliveryRepository.findMany({
      source: "manual",
      status: "delivered",
      scheduled_for: { $gte: start, $lte: end },
    });
    const invoices: IInvoice[] = [];
    for (const del of deliveries) {
      const inv = await this.invoiceManualDelivery(del as any, start, end);
      if (inv) invoices.push(inv as any);
    }
    for (const sub of subs) {
      if (!sub.items?.length) continue;
      const multiplier = this.countDeliveries(sub as any, start, end);
      const lines: IInvoiceLine[] = sub.items
        .map((it) => ({
          product_id: it.product_id,
          description: it.name,
          quantity: it.quantity * (it.billing_period === "monthly" ? 1 : multiplier),
          unit_price: it.unit_price ?? 0,
          currency_code: (it as any).currency_code,
          tax_rate: undefined,
        }))
        .filter((l) => l.quantity > 0);
      if (!lines.length) continue;
      const totals = this.calculateTotals(lines);
      const invoice = await invoiceRepository.create({
        branch_id: sub.branch_id as any,
        user_id: sub.user_id as any,
        currency_code: lines[0]?.currency_code ?? "ZAR",
        lines,
        totals,
        status: "issued",
        issue_date: start,
        due_date: end,
      });
      invoices.push(invoice as any);
    }
    return { start, end, invoices };
  }
}
