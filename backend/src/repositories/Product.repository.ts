import BaseRepository from "./Base.repository";
import Product from "../models/Product.model";
import { IProduct } from "../types/product";

class ProductRepository extends BaseRepository<IProduct> {
  findBySku(sku: string) {
    return this.findOne({ sku } as any);
  }
  listActive() {
    return this.find({ isActive: true } as any, { sort: { name: 1 } });
  }
}

export default new ProductRepository(Product);
