import BaseRepository from "./Base.repository";
import InventoryMovement from "../models/InventoryMovement.model";
import { IInventoryMovement } from "../types/inventory";

class InventoryMovementRepository extends BaseRepository<IInventoryMovement> {
  listForItem(itemId: string, limit = 50) {
    return this.find({ item: itemId } as any, { lean: true, sort: { createdAt: -1 }, limit });
  }
}

export default new InventoryMovementRepository(InventoryMovement);
