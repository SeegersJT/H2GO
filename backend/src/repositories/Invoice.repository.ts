import type { Model, HydratedDocument } from "mongoose";
import { Types } from "mongoose";
import InvoiceModel from "../models/Invoice.model";
import type { IInvoice, InvoiceStatus } from "../models/Invoice.model";
import { GenericRepository, ReadOptions, WriteOptions, PaginateResult } from "./Generic.repository";

export type InvoiceDoc = HydratedDocument<IInvoice>;

export class InvoiceRepository extends GenericRepository<IInvoice, InvoiceDoc> {
  constructor(model: Model<IInvoice, any, any, any, InvoiceDoc> = InvoiceModel as any) {
    super(model);
  }

  async findByInvoiceNo(invoiceNo: string, opts?: ReadOptions): Promise<InvoiceDoc | null> {
    return this.findOne({ invoice_no: invoiceNo }, opts);
  }

  async findByUser(userId: Types.ObjectId | string, opts?: ReadOptions): Promise<InvoiceDoc[]> {
    return this.findMany({ user_id: userId }, opts);
  }

  async findForUserAddressPeriod(
    userId: Types.ObjectId | string,
    addressId: Types.ObjectId | string,
    periodKey: string,
    opts?: ReadOptions
  ): Promise<InvoiceDoc | null> {
    return this.findOne({ user_id: userId, address_id: addressId, period_key: periodKey, active: true }, opts);
  }

  async searchInBranch(
    branchId: Types.ObjectId | string,
    q: string | undefined,
    opts?: ReadOptions & { page?: number; pageSize?: number }
  ): Promise<PaginateResult<InvoiceDoc>> {
    const filter: any = { branch_id: branchId };
    if (q && q.trim()) {
      const rx = new RegExp(q.trim().replace(/[.*+?^${}()|[\\]\\]/g, "\\$&"), "i");
      filter.$or = [{ invoice_no: rx }, { notes: rx }];
    }
    return this.paginate(filter, { ...opts, sort: opts?.sort ?? { issue_date: -1 } });
  }

  async setStatus(invoiceId: Types.ObjectId | string, status: InvoiceStatus, opts?: WriteOptions): Promise<InvoiceDoc | null> {
    return (this as any).model.findByIdAndUpdate(invoiceId, { $set: { status } }, { new: true, session: opts?.session ?? undefined }).exec();
  }

  async setTotals(invoiceId: Types.ObjectId | string, totals: IInvoice["totals"], opts?: WriteOptions): Promise<InvoiceDoc | null> {
    return (this as any).model.findByIdAndUpdate(invoiceId, { $set: { totals } }, { new: true, session: opts?.session ?? undefined }).exec();
  }
}

export const invoiceRepository = new InvoiceRepository();
