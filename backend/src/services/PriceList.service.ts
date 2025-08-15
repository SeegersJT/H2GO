import { Types } from "mongoose";
import { priceListRepository } from "../repositories/PriceList.repository";
import { IPriceList } from "../models/PriceList.model";

export class PriceListService {
  static getAll() {
    return priceListRepository.findMany({});
  }

  static getById(id: string) {
    return priceListRepository.findById(new Types.ObjectId(id));
  }

  static async insertPriceList(data: Partial<IPriceList>, actorId?: string) {
    return priceListRepository.create(data, actorId ? { actorId: new Types.ObjectId(actorId) } : undefined);
  }

  static async updatePriceList(id: string, data: Partial<IPriceList>, actorId?: string) {
    const priceList = await this.getById(id);
    if (!priceList) {
      throw new Error("Invalid or inactive price list");
    }

    return priceListRepository.updateById(new Types.ObjectId(id), data, actorId ? { actorId: new Types.ObjectId(actorId) } : undefined);
  }

  static async deletePriceList(id: string, actorId?: string) {
    const priceList = await this.getById(id);
    if (!priceList) {
      throw new Error("Invalid or inactive price list");
    }

    return priceListRepository.updateById(new Types.ObjectId(id), { active: false }, actorId ? { actorId: new Types.ObjectId(actorId) } : undefined);
  }
}
