import { Types } from "mongoose";
import { paymentRepository } from "../repositories/Payment.repository";
import { InvoiceService } from "./Invoice.service";
import { IPayment } from "../models/Payment.model";

export class PaymentService {
  static getAll() {
    return paymentRepository.findMany({});
  }

  static getById(id: string) {
    return paymentRepository.findById(new Types.ObjectId(id));
  }

  static async createPayment(data: Partial<IPayment>, actorId?: string) {
    const created = await paymentRepository.create(data as any, { actorId: new Types.ObjectId(actorId) });

    try {
      const invoiceId = (created as any).invoice_id as Types.ObjectId | undefined;
      await InvoiceService.allocatePaymentToInvoice(created.id, invoiceId);
    } catch {
      throw new Error("Failed to allocate payment to invoice");
    }

    return created;
  }

  static async reallocatePayment(paymentId: string, invoiceId: string | null) {
    if (invoiceId) {
      await paymentRepository.assignToInvoice([new Types.ObjectId(paymentId)], new Types.ObjectId(invoiceId));
      return InvoiceService.allocatePaymentToInvoice(new Types.ObjectId(paymentId), new Types.ObjectId(invoiceId));
    } else {
      await paymentRepository.updateById(new Types.ObjectId(paymentId), { invoice_id: null });
      return InvoiceService.allocatePaymentToInvoice(new Types.ObjectId(paymentId));
    }
  }

  static update(id: string, data: any, actorId?: string) {
    return paymentRepository.updateById(new Types.ObjectId(id), data, { actorId: new Types.ObjectId(actorId) });
  }

  static delete(id: string, actorId?: string) {
    return paymentRepository.deleteById(new Types.ObjectId(id), { actorId: new Types.ObjectId(actorId) });
  }
}
