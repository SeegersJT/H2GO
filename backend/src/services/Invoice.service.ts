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

  // Generation helpers
  static generateInvoicesForEligibleUsers() {
    // TODO: Implement generation logic for users with products or subscriptions
    return [];
  }

  static generateCurrentMonthInvoices() {
    // TODO: Implement generation logic for current month's invoices
    return [];
  }

  static generatePaymentsDueInvoices() {
    // TODO: Implement generation logic for all payments due
    return [];
  }

  static generateCurrentMonthInvoiceForUser(userId: string) {
    // TODO: Implement generation logic for current month invoice for a specific user
    return { userId, invoices: [] };
  }

  static generateInvoicesByDateRange(start: Date, end: Date) {
    // TODO: Implement generation logic for custom date range
    return { start, end, invoices: [] };
  }
}
