import { Types } from "mongoose";
import { priceListRepository } from "../repositories/PriceList.repository";

export class PriceListService {
  static getAll() {
    return priceListRepository.findMany({});
  }

  static getById(id: string) {
    return priceListRepository.findById(new Types.ObjectId(id));
  }

  static create(data: any) {
    return priceListRepository.create(data);
  }

  static update(id: string, data: any) {
    return priceListRepository.updateById(new Types.ObjectId(id), data);
  }

  static delete(id: string) {
    return priceListRepository.deleteById(new Types.ObjectId(id));
  }
}
