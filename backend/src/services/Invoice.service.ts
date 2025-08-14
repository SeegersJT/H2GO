import { Types } from "mongoose";
import { invoiceRepository } from "../repositories/Invoice.repository";

export class InvoiceService {
  static getAll() {
    return invoiceRepository.findMany({});
  }

  static getById(id: string) {
    return invoiceRepository.findById(new Types.ObjectId(id));
  }

  static create(data: any) {
    return invoiceRepository.create(data);
  }

  static update(id: string, data: any) {
    return invoiceRepository.updateById(new Types.ObjectId(id), data);
  }

  static delete(id: string) {
    return invoiceRepository.deleteById(new Types.ObjectId(id));
  }
}
