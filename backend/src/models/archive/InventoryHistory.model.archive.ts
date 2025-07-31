import mongoose, { Schema, Document, Types, Model } from "mongoose";

export interface IInventoryLocationHistory extends Document {
  inventory_id: Types.ObjectId;
  user_id: Types.ObjectId;
  branch_id: Types.ObjectId;
  address_id: Types.ObjectId;
  delivery_id: Types.ObjectId;
  inventory_location_type_id: Types.ObjectId;
  inventory_condition_type_id: Types.ObjectId;
  note: string;
  createdBy: Types.ObjectId;
  updatedBy: Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

const inventoryLocationHistorySchema = new Schema<IInventoryLocationHistory>(
  {
    inventory_id: { type: Schema.Types.ObjectId, ref: "Inventory", required: true },
    user_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
    branch_id: { type: Schema.Types.ObjectId, ref: "Branch", required: true },
    address_id: { type: Schema.Types.ObjectId, ref: "Address", required: true },
    delivery_id: { type: Schema.Types.ObjectId, ref: "Delivery", required: true },
    inventory_location_type_id: { type: Schema.Types.ObjectId, ref: "InventoryLocationType", required: true },
    inventory_condition_type_id: { type: Schema.Types.ObjectId, ref: "InventoryConditionType", required: true },
    note: { type: String, required: true },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    updatedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  {
    timestamps: true,
  }
);

const InventoryLocationHistory: Model<IInventoryLocationHistory> = mongoose.model<IInventoryLocationHistory>(
  "InventoryLocationHistory",
  inventoryLocationHistorySchema
);
export default InventoryLocationHistory;

// TODO: Look into Archive table storage
