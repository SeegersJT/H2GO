import { Types } from "mongoose";
import { priceListRepository } from "../repositories/PriceList.repository";
import { IPriceList } from "../models/PriceList.model";
import { HttpError } from "../utils/HttpError";
import { StatusCode } from "../utils/constants/StatusCode.constant";

export class PriceListService {
  static getAll() {
    return priceListRepository.findMany({});
  }

  static getById(id: string) {
    return priceListRepository.findById(new Types.ObjectId(id));
  }

  static async insertPriceList(data: Partial<IPriceList>, actorId: string) {
    return priceListRepository.create(data, { actorId: new Types.ObjectId(actorId) });
  }

  static async updatePriceList(id: string, data: Partial<IPriceList>, actorId: string) {
    const priceList = await this.getById(id);
    if (!priceList) {
      throw new HttpError("Invalid or inactive price list", StatusCode.NOT_FOUND);
    }

    return priceListRepository.updateById(new Types.ObjectId(id), data, { actorId: new Types.ObjectId(actorId) });
  }

  static async deletePriceList(id: string, actorId: string) {
    const priceList = await this.getById(id);
    if (!priceList) {
      throw new HttpError("Invalid or inactive price list", StatusCode.NOT_FOUND);
    }

    return priceListRepository.updateById(new Types.ObjectId(id), { active: false }, { actorId: new Types.ObjectId(actorId) });
  }
}
