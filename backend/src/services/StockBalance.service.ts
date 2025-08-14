import { Types } from "mongoose";
import { stockBalanceRepository } from "../repositories/StockBalance.repository";

export class StockBalanceService {
  static getAll() {
    return stockBalanceRepository.findMany({});
  }

  static getById(id: string) {
    return stockBalanceRepository.findById(new Types.ObjectId(id));
  }

  static create(data: any) {
    return stockBalanceRepository.create(data);
  }

  static update(id: string, data: any) {
    return stockBalanceRepository.updateById(new Types.ObjectId(id), data);
  }

  static delete(id: string) {
    return stockBalanceRepository.deleteById(new Types.ObjectId(id));
  }
}
