import type { Model, HydratedDocument } from "mongoose";
import { Types } from "mongoose";
import PaymentModel from "../models/Payment.model";
import type { IPayment, PaymentStatus } from "../models/Payment.model";
import { GenericRepository, ReadOptions, WriteOptions, PaginateResult } from "./Generic.repository";

export type PaymentDoc = HydratedDocument<IPayment>;

export class PaymentRepository extends GenericRepository<IPayment, PaymentDoc> {
  constructor(model: Model<IPayment, any, any, any, PaymentDoc> = PaymentModel as any) {
    super(model);
  }

  async findByPaymentNo(paymentNo: string, opts?: ReadOptions): Promise<PaymentDoc | null> {
    return this.findOne({ payment_no: paymentNo }, opts);
  }

  async findByInvoice(invoiceId: Types.ObjectId | string, opts?: ReadOptions): Promise<PaymentDoc[]> {
    return this.findMany({ invoice_id: invoiceId }, opts);
  }

  async findByUser(userId: Types.ObjectId | string, opts?: ReadOptions): Promise<PaymentDoc[]> {
    return this.findMany({ user_id: userId }, opts);
  }

  async searchInBranch(
    branchId: Types.ObjectId | string,
    q: string | undefined,
    opts?: ReadOptions & { page?: number; pageSize?: number }
  ): Promise<PaginateResult<PaymentDoc>> {
    const filter: any = { branch_id: branchId };
    if (q && q.trim()) {
      const rx = new RegExp(q.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
      filter.$or = [{ payment_no: rx }, { reference: rx }];
    }
    return this.paginate(filter, { ...opts, sort: opts?.sort ?? { received_at: -1 } });
  }

  async setStatus(paymentId: Types.ObjectId | string, status: PaymentStatus, opts?: WriteOptions): Promise<PaymentDoc | null> {
    return (this as any).model.findByIdAndUpdate(paymentId, { $set: { status } }, { new: true, session: opts?.session ?? undefined }).exec();
  }
}

export const paymentRepository = new PaymentRepository();
