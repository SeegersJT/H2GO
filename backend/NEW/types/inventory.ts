import { ObjectId } from "./core";

export type InventoryLocationType = "BRANCH" | "VEHICLE" | "ADDRESS" | "DISPOSED";
export type InventoryItemCondition = "GOOD" | "DAMAGED" | "NEEDS_CLEANING" | "LOST";
export type InventoryItemStatus = "AVAILABLE" | "ALLOCATED" | "IN_TRANSIT" | "CONSUMED" | "RETIRED";
export type MovementReason = "ALLOCATE" | "LOAD_VEHICLE" | "DELIVER" | "RETURN" | "SWAP_OUT" | "SWAP_IN" | "ADJUSTMENT";

export interface IInventoryLocation {
  type: InventoryLocationType;
  refId?: ObjectId;
}

export interface IInventoryItem {
  _id: ObjectId;
  product: ObjectId;
  serial?: string;
  quantity: number;
  isAsset: boolean;
  condition: InventoryItemCondition;
  location: IInventoryLocation;
  status: InventoryItemStatus;
  metadata?: Record<string, any>;
}

export interface IInventoryMovement {
  _id: ObjectId;
  item: ObjectId;
  from?: IInventoryLocation;
  to: IInventoryLocation;
  reason: MovementReason;
  quantity: number;
  delivery?: ObjectId;
  note?: string;
}
