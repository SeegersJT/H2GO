import { Types } from "mongoose";
import { assetRepository } from "../repositories/Asset.repository";
import { IAsset } from "../models/Asset.model";

export class AssetService {
  static getAll() {
    return assetRepository.findMany({});
  }

  static getById(id: string) {
    return assetRepository.findById(new Types.ObjectId(id));
  }

  static async insertAsset(data: Partial<IAsset>, actorId?: string) {
    return assetRepository.create(data, actorId ? { actorId: new Types.ObjectId(actorId) } : undefined);
  }

  static async updateAsset(id: string, data: Partial<IAsset>, actorId?: string) {
    const asset = await this.getById(id);
    if (!asset) {
      throw new Error("Invalid or inactive asset");
    }

    return assetRepository.updateById(new Types.ObjectId(id), data, actorId ? { actorId: new Types.ObjectId(actorId) } : undefined);
  }

  static async deleteAsset(id: string, actorId?: string) {
    const asset = await this.getById(id);
    if (!asset) {
      throw new Error("Invalid or inactive asset");
    }

    return assetRepository.updateById(new Types.ObjectId(id), { active: false }, actorId ? { actorId: new Types.ObjectId(actorId) } : undefined);
  }
}
