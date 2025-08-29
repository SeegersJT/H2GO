import { Types } from "mongoose";
import { productRepository } from "../repositories/Product.repository";
import { IProduct } from "../models/Product.model";
import { HttpError } from "../utils/HttpError";
import { StatusCode } from "../utils/constants/StatusCode.constant";

export class ProductService {
  static getAll() {
    return productRepository.findMany({});
  }

  static getById(id: string) {
    return productRepository.findById(new Types.ObjectId(id));
  }

  static async insertProduct(data: Partial<IProduct>, actorId: string) {
    return productRepository.create(data, { actorId: new Types.ObjectId(actorId) });
  }

  static async updateProduct(id: string, data: Partial<IProduct>, actorId: string) {
    const product = await this.getById(id);
    if (!product) {
      throw new HttpError("Invalid or inactive product", StatusCode.NOT_FOUND);
    }

    return productRepository.updateById(new Types.ObjectId(id), data, { actorId: new Types.ObjectId(actorId) });
  }

  static async deleteProduct(id: string, actorId: string) {
    const product = await this.getById(id);
    if (!product) {
      throw new HttpError("Invalid or inactive product", StatusCode.NOT_FOUND);
    }

    return productRepository.updateById(new Types.ObjectId(id), { active: false }, { actorId: new Types.ObjectId(actorId) });
  }
}
