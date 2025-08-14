import { Types } from "mongoose";
import { assetRepository } from "../repositories/Asset.repository";

export class AssetService {
  static getAll() {
    return assetRepository.findMany({});
  }

  static getById(id: string) {
    return assetRepository.findById(new Types.ObjectId(id));
  }

  static create(data: any) {
    return assetRepository.create(data);
  }

  static update(id: string, data: any) {
    return assetRepository.updateById(new Types.ObjectId(id), data);
  }

  static delete(id: string) {
    return assetRepository.deleteById(new Types.ObjectId(id));
  }
}
