import { Types } from "mongoose";
import { paymentRepository } from "../repositories/Payment.repository";

export class PaymentService {
  static getAll() {
    return paymentRepository.findMany({});
  }

  static getById(id: string) {
    return paymentRepository.findById(new Types.ObjectId(id));
  }

  static create(data: any) {
    return paymentRepository.create(data);
  }

  static update(id: string, data: any) {
    return paymentRepository.updateById(new Types.ObjectId(id), data);
  }

  static delete(id: string) {
    return paymentRepository.deleteById(new Types.ObjectId(id));
  }
}
