import { Types } from "mongoose";
import { productRepository } from "../repositories/Product.repository";

export class ProductService {
  static getAll() {
    return productRepository.findMany({});
  }

  static getById(id: string) {
    return productRepository.findById(new Types.ObjectId(id));
  }

  static create(data: any) {
    return productRepository.create(data);
  }

  static update(id: string, data: any) {
    return productRepository.updateById(new Types.ObjectId(id), data);
  }

  static delete(id: string) {
    return productRepository.deleteById(new Types.ObjectId(id));
  }
}
