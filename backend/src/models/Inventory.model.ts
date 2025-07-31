import mongoose, { Schema, Document, Types, Model } from "mongoose";

export interface IInventory extends Document {
  serial_number: string;
  product_id: Types.ObjectId;
  inventory_location_type_id: Types.ObjectId;
  inventory_condition_type_id: Types.ObjectId;
  active: boolean;
  createdBy: Types.ObjectId;
  updatedBy: Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

const inventorySchema = new Schema<IInventory>(
  {
    serial_number: { type: String, required: true },
    product_id: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    inventory_location_type_id: { type: Schema.Types.ObjectId, ref: "InventoryLocationType", required: true },
    inventory_condition_type_id: { type: Schema.Types.ObjectId, ref: "InventoryConditionType", required: true },
    active: { type: Boolean, required: true },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    updatedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  {
    timestamps: true,
  }
);

const Inventory: Model<IInventory> = mongoose.model<IInventory>("Inventory", inventorySchema);
export default Inventory;
