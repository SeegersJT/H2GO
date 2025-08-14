import { Types } from "mongoose";
import { customerRepository } from "../repositories/Customer.repository";

export class CustomerService {
  static getAll() {
    return customerRepository.findMany({});
  }

  static getById(id: string) {
    return customerRepository.findById(new Types.ObjectId(id));
  }

  static create(data: any) {
    return customerRepository.create(data);
  }

  static update(id: string, data: any) {
    return customerRepository.updateById(new Types.ObjectId(id), data);
  }

  static delete(id: string) {
    return customerRepository.deleteById(new Types.ObjectId(id));
  }
}
