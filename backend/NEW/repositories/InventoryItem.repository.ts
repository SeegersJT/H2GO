import BaseRepository from "./Base.repository";
import InventoryItem from "../models/InventoryItem.model";
import { IInventoryItem, InventoryItemStatus, InventoryLocationType } from "../types/inventory";

class InventoryItemRepository extends BaseRepository<IInventoryItem> {
  listAtLocation(type: InventoryLocationType, refId?: string) {
    return this.find({ "location.type": type, "location.refId": refId } as any, { lean: true });
  }
  listAvailableByProduct(productId: string) {
    return this.find({ product: productId, status: "AVAILABLE" as InventoryItemStatus } as any, { lean: true });
  }
}

export default new InventoryItemRepository(InventoryItem);
