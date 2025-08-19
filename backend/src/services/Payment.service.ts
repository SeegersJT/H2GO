import { Types } from "mongoose";
import { paymentRepository } from "../repositories/Payment.repository";

export class PaymentService {
  static getAll() {
    return paymentRepository.findMany({});
  }

  static getById(id: string) {
    return paymentRepository.findById(new Types.ObjectId(id));
  }

  static async createPayment(data: Partial<IPayment>, actorId?: string) {
    const created = await paymentRepository.create(data as any, actorId ? { actorId: new Types.ObjectId(actorId) } : undefined);

    try {
      await InvoiceService.allocatePaymentToInvoice(created._id, (created as any).invoice_id ?? undefined);
    } catch {
      // swallow allocation errors; optionally log
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

  static update(id: string, data: any) {
    return paymentRepository.updateById(new Types.ObjectId(id), data);
  }

  static delete(id: string) {
    return paymentRepository.deleteById(new Types.ObjectId(id));
  }
}
