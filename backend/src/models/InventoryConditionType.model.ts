import mongoose, { Schema, Document, Types, Model } from "mongoose";

export interface IInventoryConditionType extends Document {
  condition_type_name: string;
  createdBy: Types.ObjectId;
  updatedBy: Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

const inventoryConditionSchema = new Schema<IInventoryConditionType>(
  {
    condition_type_name: { type: String, required: true },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    updatedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  {
    timestamps: true,
  }
);

const InventoryConditionType: Model<IInventoryConditionType> = mongoose.model<IInventoryConditionType>(
  "InventoryConditionType",
  inventoryConditionSchema
);
export default InventoryConditionType;

/*
  EXAMPLE:

  good
  damaged
  lost
  under_maintenance
  cleaning_required
  decomissioned
  expired
*/
