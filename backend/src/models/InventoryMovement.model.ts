import mongoose, { Model, Schema } from "mongoose";
import { IInventoryMovement } from "../types/inventory";

const EndSchema = new Schema(
  {
    type: { type: String, enum: ["BRANCH", "VEHICLE", "ADDRESS", "DISPOSED"], required: true },
    refId: { type: Schema.Types.ObjectId },
  },
  { _id: false }
);

const InventoryMovementSchema = new Schema<IInventoryMovement>(
  {
    item: { type: Schema.Types.ObjectId, ref: "InventoryMovement", required: true, index: true },
    from: { type: EndSchema },
    to: { type: EndSchema, required: true },
    reason: { type: String, enum: ["ALLOCATE", "LOAD_VEHICLE", "DELIVER", "RETURN", "SWAP_OUT", "SWAP_IN", "ADJUSTMENT"], required: true },
    quantity: { type: Number, default: 1, min: 0 },
    delivery: { type: Schema.Types.ObjectId, ref: "Delivery" },
    note: String,
  },
  { timestamps: true }
);

const InventoryMovement: Model<IInventoryMovement> = mongoose.model<IInventoryMovement>("InventoryMovement", InventoryMovementSchema);
export default InventoryMovement;
