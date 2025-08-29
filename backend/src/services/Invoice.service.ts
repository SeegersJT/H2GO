import { Types } from "mongoose";
import dayjs from "dayjs";
import { invoiceRepository } from "../repositories/Invoice.repository";
import { paymentRepository } from "../repositories/Payment.repository";
import { IInvoice, IInvoiceLine, IInvoicePayment } from "../models/Invoice.model";
import { subscriptionRepository } from "../repositories/Subscription.repository";
import { deliveryRepository } from "../repositories/Delivery.repository";
import { IDelivery } from "../models/Delivery.model";
import { ISubscription } from "../models/Subscription.model";

function monthBounds(year: number, month1to12: number) {
  const start = dayjs(`${year}-${String(month1to12).padStart(2, "0")}-01`)
    .startOf("month")
    .toDate();
  const end = dayjs(start).endOf("month").toDate();
  return { start, end };
}

export class InvoiceService {
  static getAll() {
    return invoiceRepository.findMany({});
  }

  static getById(id: string) {
    return invoiceRepository.findById(new Types.ObjectId(id));
  }

  static insertInvoice(data: Partial<IInvoice>, actorId: string) {
    return invoiceRepository.create(data, { actorId: new Types.ObjectId(actorId) });
  }

  static updateInvoice(id: string, data: Partial<IInvoice>, actorId: string) {
    return invoiceRepository.updateById(new Types.ObjectId(id), data, { actorId: new Types.ObjectId(actorId) });
  }

  static deleteInvoice(id: string, actorId: string) {
    return invoiceRepository.updateById(new Types.ObjectId(id), { active: false }, { actorId: new Types.ObjectId(actorId) });
  }

  private static calculateTotals(lines: IInvoiceLine[]): { subtotal: number; tax: number; total: number } {
    let subtotal = 0;
    let tax = 0;
    for (const l of lines) {
      const lineSubtotal = l.quantity * l.unit_price;
      const lineTax = l.tax_rate ? (lineSubtotal * l.tax_rate) / 100 : 0;
      l.line_subtotal = lineSubtotal;
      l.line_tax = lineTax;
      l.line_total = lineSubtotal + lineTax;
      subtotal += lineSubtotal;
      tax += lineTax;
    }
    return { subtotal, tax, total: subtotal + tax };
  }

  private static formatPaymentReference(userId: Types.ObjectId, issueDate: Date, invoiceNo?: string) {
    if (invoiceNo) return invoiceNo;
    const ym = dayjs(issueDate).format("YYYYMM");
    const shortUser = String(userId).slice(-6).toUpperCase();
    return `INV-${ym}-${shortUser}`;
  }

  private static aggregateLines(lines: IInvoiceLine[], lineDateForPeriod: Date): IInvoiceLine[] {
    const map = new Map<string, IInvoiceLine>();
    for (const l of lines) {
      if (l.unit_price <= 0) continue;
      const key = `${l.product_id}:${l.unit_price}:${l.description ?? ""}:${l.currency_code ?? ""}`;
      const existing = map.get(key);
      if (existing) existing.quantity += l.quantity;
      else map.set(key, { ...l, line_date: lineDateForPeriod });
    }
    return Array.from(map.values());
  }

  private static sumDeliveryCharge(del: IDelivery): number {
    if (!del.items?.length) return 0;
    return del.items.reduce((acc, it) => acc + Math.max(0, it.unit_price ?? 0) * Math.max(1, it.quantity ?? 0), 0);
  }

  private static toInvoicePaymentSnapshot(p: any): IInvoicePayment {
    return {
      payment_id: p._id,
      payment_no: p.payment_no,
      status: p.status,
      method: p.method,
      amount: p.amount,
      fee: p.fee,
      reference: p.reference,
      received_at: p.received_at,
    };
  }

  private static sumAmountPaid(payments: IInvoicePayment[]) {
    return payments.filter((p) => p.status === "succeeded").reduce((acc, p) => acc + Math.max(0, p.amount ?? 0), 0);
  }

  /** Public: recompute invoice’s payments snapshot + amount_paid/balance_due/status. */
  static async recomputeInvoicePayments(invoiceId: Types.ObjectId | string) {
    const inv = await invoiceRepository.findById(invoiceId);
    if (!inv) return null;

    const pays = await paymentRepository.findMany({ invoice_id: inv._id });
    const snapshots: IInvoicePayment[] = pays.map(this.toInvoicePaymentSnapshot);
    const amount_paid = this.sumAmountPaid(snapshots);
    const total = inv.totals?.total ?? 0;
    const balance_due = Math.max(0, total - amount_paid);

    // keep VOIDED untouched
    let status = inv.status;
    if (status !== "voided") {
      if (balance_due <= 0 && total > 0) status = "paid";
      else if (amount_paid > 0 && amount_paid < total) status = "partially_paid";
      else if (amount_paid === 0) status = "issued";
    }

    await invoiceRepository.updateById(inv._id, {
      payments: snapshots,
      totals: { ...(inv.totals ?? {}), amount_paid, balance_due },
      status,
    });

    return invoiceRepository.findById(inv._id);
  }

  /** Public: allocate a payment to an invoice or auto-allocate to oldest open. */
  static async allocatePaymentToInvoice(paymentId: Types.ObjectId | string, invoiceId?: Types.ObjectId | string) {
    const pay = await paymentRepository.findById(paymentId);
    if (!pay) throw new Error("Payment not found.");
    if (pay.status !== "succeeded") throw new Error("Only succeeded payments can be allocated.");

    let target = invoiceId ? await invoiceRepository.findById(invoiceId) : null;

    // fallback: oldest open invoice (FIFO) in same currency
    if (!target) {
      const filter: any = { user_id: pay.user_id, active: true, status: { $in: ["issued", "partially_paid"] } };
      if (pay.currency_code) filter.currency_code = pay.currency_code.toUpperCase();
      const candidates = await invoiceRepository.findMany(filter, { sort: { issue_date: 1 } });
      target = candidates[0] ?? null;
    }
    if (!target) return { applied: false, reason: "No open invoices to allocate." };

    await paymentRepository.assignToInvoice([pay.id], target.id);
    const updated = await this.recomputeInvoicePayments(target.id);
    return { applied: true, invoice: updated };
  }

  private static async findSucceededUnassignedPaymentsForPeriod(userId: Types.ObjectId, start: Date, end: Date) {
    return paymentRepository.findMany({
      user_id: userId,
      status: "succeeded",
      invoice_id: null,
      received_at: { $gte: start, $lte: end },
    });
  }

  private static async createInvoiceForGroup(
    deliveries: IDelivery[],
    subs: ISubscription[],
    branchId: Types.ObjectId,
    userId: Types.ObjectId,
    addressId: Types.ObjectId,
    issueDate: Date,
    dueDate: Date,
    start: Date,
    end: Date,
    periodYear: number,
    periodMonth: number,
    actorId: string
  ) {
    const rawLines: IInvoiceLine[] = [];
    const deliverySummaries: {
      delivery_id: Types.ObjectId;
      delivery_no: string;
      status: string;
      scheduled_for?: Date;
      source?: "manual" | "subscription" | "api";
      chargeable?: boolean;
      amount?: number;
    }[] = [];

    // deliveries → raw lines + statement
    for (const del of deliveries) {
      const amount = this.sumDeliveryCharge(del);
      deliverySummaries.push({
        delivery_id: del._id as any,
        delivery_no: (del as any).delivery_no,
        status: (del as any).status,
        scheduled_for: del.scheduled_for,
        source: (del as any).source,
        chargeable: amount > 0,
        amount,
      });
      if (!del.items?.length) continue;
      for (const it of del.items) {
        const unit = Math.max(0, it.unit_price ?? 0);
        if (unit <= 0) continue;
        rawLines.push({
          product_id: it.product_id,
          description: it.name,
          quantity: Math.max(1, it.quantity ?? 1),
          unit_price: unit,
          currency_code: "ZAR",
        });
      }
    }

    // subscriptions → raw lines
    for (const sub of subs) {
      if (!sub.items?.length) continue;
      for (const it of sub.items) {
        if (it.billing_period !== "monthly") continue;
        const unit = Math.max(0, it.unit_price ?? 0);
        if (unit <= 0) continue;
        rawLines.push({
          product_id: it.product_id,
          description: it.name ?? "Monthly subscription",
          quantity: Math.max(1, it.quantity ?? 1),
          unit_price: unit,
          currency_code: "ZAR",
        });
      }
    }

    const lineDateForPeriod = dayjs(end).toDate();
    const mergedLines = this.aggregateLines(rawLines, lineDateForPeriod);
    if (!mergedLines.length) return null;

    const period_key = `${String(periodYear).padStart(4, "0")}-${String(periodMonth).padStart(2, "0")}`;
    const existing = await invoiceRepository.findOne({ user_id: userId, address_id: addressId, period_key, active: true });
    if (existing) return existing as any;

    const totals = this.calculateTotals(mergedLines);

    // collect unassigned payments for the month
    const periodPayments = await this.findSucceededUnassignedPaymentsForPeriod(userId, start, end);
    const paymentSnapshots: IInvoicePayment[] = periodPayments.map(this.toInvoicePaymentSnapshot);
    const amount_paid = this.sumAmountPaid(paymentSnapshots);
    const balance_due = Math.max(0, (totals.total ?? 0) - amount_paid);

    const created = await invoiceRepository.create(
      {
        branch_id: branchId as any,
        user_id: userId as any,
        address_id: addressId as any,
        currency_code: mergedLines[0]?.currency_code ?? "ZAR",
        lines: mergedLines,
        deliveries: deliverySummaries,
        payments: paymentSnapshots,
        totals: { ...totals, amount_paid, balance_due },
        status: balance_due <= 0 ? "paid" : "issued",
        issue_date: issueDate,
        due_date: dueDate,
        period_year: periodYear,
        period_month: periodMonth,
        period_key,
      },
      { actorId: new Types.ObjectId(actorId) }
    );

    if (!(created as any).payment_reference) {
      const payment_reference = this.formatPaymentReference(userId, issueDate, (created as any).invoice_no);
      await invoiceRepository.updateById((created as any)._id, { payment_reference }, undefined);
      (created as any).payment_reference = payment_reference;
    }

    // lock those payments to this invoice
    if (periodPayments.length) {
      await paymentRepository.assignToInvoice(
        periodPayments.map((p: any) => p._id),
        (created as any)._id
      );
    }

    return created;
  }

  private static async generateInvoices(
    deliveries: IDelivery[],
    subs: ISubscription[],
    start: Date,
    end: Date,
    periodYear: number,
    periodMonth: number,
    actorId: string
  ) {
    interface Group {
      deliveries: IDelivery[];
      subs: ISubscription[];
      branch_id: Types.ObjectId;
      user_id: Types.ObjectId;
      address_id: Types.ObjectId;
    }

    const groups = new Map<string, Group>();

    for (const del of deliveries) {
      const key = `${del.user_id}:${del.address_id}`;
      const g = groups.get(key);
      if (g) g.deliveries.push(del);
      else {
        groups.set(key, {
          deliveries: [del],
          subs: [],
          branch_id: del.branch_id as any,
          user_id: del.user_id as any,
          address_id: del.address_id as any,
        });
      }
    }

    for (const sub of subs) {
      const key = `${sub.user_id}:${sub.address_id}`;
      const g = groups.get(key);
      if (g) g.subs.push(sub);
      else {
        groups.set(key, {
          deliveries: [],
          subs: [sub],
          branch_id: sub.branch_id as any,
          user_id: sub.user_id as any,
          address_id: sub.address_id as any,
        });
      }
    }

    const invoices: IInvoice[] = [];
    for (const g of groups.values()) {
      const issueDate = new Date();
      const dueDate = dayjs(issueDate).add(30, "day").toDate();

      const inv = await this.createInvoiceForGroup(
        g.deliveries,
        g.subs,
        g.branch_id,
        g.user_id,
        g.address_id,
        issueDate,
        dueDate,
        start,
        end,
        periodYear,
        periodMonth,
        actorId
      );
      if (inv) invoices.push(inv as any);
    }
    return invoices;
  }

  static async generateInvoicesForMonth(year: number, month: number, actorId: string) {
    const { start, end } = monthBounds(year, month);
    const subs = await subscriptionRepository.findMany({ status: "active" });
    const deliveries = await deliveryRepository.findMany({
      source: { $in: ["manual", "subscription"] },
      scheduled_for: { $gte: start, $lte: end },
    });
    return this.generateInvoices(deliveries as any, subs as any, start, end, year, month, actorId);
  }

  static async generateCurrentMonthInvoices(actorId: string) {
    const now = dayjs();
    return this.generateInvoicesForMonth(now.year(), now.month() + 1, actorId);
  }

  static async generateInvoiceForUserAndMonth(userId: string, year: number, month: number, actorId: string) {
    const userObjId = new Types.ObjectId(userId);
    const { start, end } = monthBounds(year, month);

    const subs = await subscriptionRepository.findByUser(userObjId);
    const deliveries = await deliveryRepository.findMany({
      user_id: userObjId,
      source: { $in: ["manual", "subscription"] },
      scheduled_for: { $gte: start, $lte: end },
    });

    const invoices = await this.generateInvoices(deliveries as any, subs as any, start, end, year, month, actorId);
    return { userId, year, month, invoices };
  }
}
