import { Types } from "mongoose";
import { customerRepository } from "../repositories/Customer.repository";
import { ICustomer } from "../models/Customer.model";

export class CustomerService {
  static getAll() {
    return customerRepository.findMany({});
  }

  static getById(id: string) {
    return customerRepository.findById(new Types.ObjectId(id));
  }

  static insertCustomer(data: Partial<ICustomer>, actorId?: string) {
    return customerRepository.create(data, actorId ? { actorId: new Types.ObjectId(actorId) } : undefined);
  }

  static updateCustomer(id: string, data: Partial<ICustomer>, actorId?: string) {
    const customer = this.getById(id);
    if (!customer) {
      throw new Error("Invalid or inactive customer");
    }

    return customerRepository.updateById(new Types.ObjectId(id), data, actorId ? { actorId: new Types.ObjectId(actorId) } : undefined);
  }

  static deleteCustomer(id: string, actorId?: string) {
    return customerRepository.updateById(new Types.ObjectId(id), { active: false }, actorId ? { actorId: new Types.ObjectId(actorId) } : undefined);
  }
}
