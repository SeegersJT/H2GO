import mongoose, { Model, Schema } from "mongoose";
import { IInventoryItem, IInventoryLocation } from "../types/inventory";

const LocationSchema = new Schema<IInventoryLocation>(
  {
    type: { type: String, enum: ["BRANCH", "VEHICLE", "ADDRESS", "DISPOSED"], required: true },
    refId: { type: Schema.Types.ObjectId },
  },
  { _id: false }
);

const InventoryItemSchema = new Schema<IInventoryItem>(
  {
    product: { type: Schema.Types.ObjectId, ref: "Product", required: true, index: true },
    serial: { type: String, index: true },
    quantity: { type: Number, default: 1, min: 0 },
    isAsset: { type: Boolean, required: true },
    condition: { type: String, enum: ["GOOD", "DAMAGED", "NEEDS_CLEANING", "LOST"], default: "GOOD" },
    location: { type: LocationSchema, required: true },
    status: { type: String, enum: ["AVAILABLE", "ALLOCATED", "IN_TRANSIT", "CONSUMED", "RETIRED"], default: "AVAILABLE" },
    metadata: { type: Schema.Types.Mixed },
  },
  { timestamps: true }
);

InventoryItemSchema.index({ "location.type": 1, "location.refId": 1 });
InventoryItemSchema.index({ isAsset: 1, status: 1 });

const InventoryItem: Model<IInventoryItem> = mongoose.model<IInventoryItem>("InventoryItem", InventoryItemSchema);
export default InventoryItem;
