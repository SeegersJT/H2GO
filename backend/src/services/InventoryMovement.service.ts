import { Types } from "mongoose";
import { inventoryMovementRepository } from "../repositories/InventoryMovement.repository";

export class InventoryMovementService {
  static getAll() {
    return inventoryMovementRepository.findMany({});
  }

  static getById(id: string) {
    return inventoryMovementRepository.findById(new Types.ObjectId(id));
  }

  static create(data: any) {
    return inventoryMovementRepository.create(data);
  }

  static update(id: string, data: any) {
    return inventoryMovementRepository.updateById(new Types.ObjectId(id), data);
  }

  static delete(id: string) {
    return inventoryMovementRepository.deleteById(new Types.ObjectId(id));
  }
}
