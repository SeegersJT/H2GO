import { Types } from "mongoose";
import { invoiceRepository } from "../repositories/Invoice.repository";
import { IInvoice } from "../models/Invoice.model";

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
}
